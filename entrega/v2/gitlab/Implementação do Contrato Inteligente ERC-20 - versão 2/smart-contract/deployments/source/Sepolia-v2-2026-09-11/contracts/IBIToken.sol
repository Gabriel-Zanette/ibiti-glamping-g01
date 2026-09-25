// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

import {ERC20} from "./vendor/openzeppelin/token/ERC20/ERC20.sol";
import {ERC20Pausable} from "./vendor/openzeppelin/token/ERC20/extensions/ERC20Pausable.sol";
import {IERC20} from "./vendor/openzeppelin/token/ERC20/IERC20.sol";
import {SafeERC20} from "./vendor/openzeppelin/token/ERC20/utils/SafeERC20.sol";
import {Ownable, Ownable2Step} from "./vendor/openzeppelin/access/Ownable2Step.sol";
import {ReentrancyGuard} from "./vendor/openzeppelin/utils/ReentrancyGuard.sol";

/**
 * @title IBIToken — cota de apoiador do IBITI Glamping
 * @author Grupo G01 · Inteli
 * @notice ERC-20 indivisível para posse, transferências e royalties de 15% do faturamento bruto.
 * @dev Versão 2: hospedagens, identidade e cotas são controladas em offchain/ por pessoa.
 * Não há marcação de resgate, IDs por unidade nem queima por hospedagem neste contrato.
 * O token usa componentes OpenZeppelin 5.6.1. Administração em dois passos, pausa,
 * reserva, teto por carteira e recuperação de acesso são mecanismos efetivamente usados.
 * Verificação civil, teto agregado por pessoa e calendário de apuração exigem operação externa.
 * Esta fonte não é o bytecode v1 publicado em 11/09/2026; requer nova publicação pelo Remix.
 */
contract IBIToken is ERC20, ERC20Pausable, Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─────────────────────────────────────────────────────────────────────────────
    // Parâmetros fixos do modelo
    // ─────────────────────────────────────────────────────────────────────────────

    /// @notice Alíquota do contrato de royalties do território para investimento de terceiro: 15%.
    uint256 public constant ROYALTY_BPS = 1_500;
    uint256 public constant BPS_DENOMINATOR = 10_000;

    /// @notice Apurações semestrais ao longo dos 4 anos de validade: 8 períodos (2027-1 … 2030-2).
    uint8 public constant TOTAL_PERIODS = 8;

    /// @notice Teto da emissão única (projeção do whitepaper: 150 unidades). Não existe mint depois do deploy.
    uint256 public immutable emissionCap;

    /// @notice Máximo de unidades por carteira = 2 dos 15 pontos do royalty = 2/15 do supply (projeção: 20).
    ///         A carteira administrativa (reserva da IBITI) é isenta.
    uint256 public immutable maxPerWallet;

    /// @notice Início do período de utilização, consultado pelo serviço off-chain.
    uint64 public immutable validFrom;

    /// @notice Fim da validade: depois desta data o contrato rejeita transferências.
    uint64 public immutable validUntil;

    // ─────────────────────────────────────────────────────────────────────────────
    // Estado
    // ─────────────────────────────────────────────────────────────────────────────

    /// @notice Unidades que a carteira administrativa deve manter (reserva da IBITI = 5 dos 15 pontos
    ///         do royalty = 1/3 do supply; projeção: 50). Só pode ser reduzida, por decisão expressa.
    uint256 public reservedUnits;

    /// @notice Stablecoin usada para pagar os royalties on-chain. Endereço zero = liquidação fora da blockchain.
    IERC20 public stablecoin;

    /// @notice Último período (semestre) já reportado pela IBITI (0 = nenhum).
    uint8 public lastReportedPeriod;

    /// @notice Carteiras invalidadas por reemissão (perda de chave / sucessão). Não recebem, não transferem, não sacam.
    mapping(address => bool) public revoked;

    /// @dev Registro enumerável de carteiras com saldo > 0 (limitado pelo supply: no máximo `emissionCap` endereços).
    address[] private _holders;
    mapping(address => uint256) private _holderIndex; // índice + 1; 0 = não está no registro

    struct Period {
        uint256 grossRevenue;   // faturamento bruto reportado (diárias + consumo), na unidade de conta adotada
        uint256 royaltyAmount;  // 15% do faturamento bruto
        uint256 totalDue;       // soma dos valores registrados por carteira (<= royaltyAmount por arredondamento)
        uint256 snapshotSupply; // supply na fotografia de saldos (constante: não há queima nem mint)
        uint256 holderCount;    // carteiras contempladas
        bytes32 reportHash;     // hash do relatório financeiro que sustenta o valor
        uint64 reportedAt;      // timestamp do reporte (data de corte da fotografia)
        bool onChain;           // true = royalty depositado em stablecoin neste contrato, sacável por claimRoyalty
    }

    mapping(uint8 => Period) private _periods;

    /// @notice Valor de royalty ainda NÃO liquidado por período e carteira (registrado na fotografia do reporte).
    mapping(uint8 => mapping(address => uint256)) public royaltyDue;

    /// @notice Valor de royalty já liquidado (sacado em stablecoin ou pago fora da blockchain) por período e carteira.
    mapping(uint8 => mapping(address => uint256)) public royaltyPaid;

    // ─────────────────────────────────────────────────────────────────────────────
    // Eventos (seção 9.3 do whitepaper — nenhum contém dado pessoal)
    // ─────────────────────────────────────────────────────────────────────────────

    event Emission(address indexed admin, uint256 emissionCap, uint256 reservedUnits, uint256 maxPerWallet, uint64 validFrom, uint64 validUntil);
    event PrimaryPurchase(address indexed to, uint256 units, bytes32 saleRef);
    event RevenueReported(uint8 indexed period, uint256 grossRevenue, uint256 royaltyAmount, bytes32 reportHash, uint256 snapshotSupply, uint256 holderCount, bool onChain);
    event RoyaltyRegistered(uint8 indexed period, address indexed holder, uint256 amount);
    event RoyaltyClaimed(uint8 indexed period, address indexed holder, uint256 amount);
    event RoyaltySettledOffChain(uint8 indexed period, address indexed holder, uint256 amount, bytes32 paymentRef);
    event Reissued(address indexed oldWallet, address indexed newWallet, uint256 units);
    event ReserveReduced(uint256 previousReserve, uint256 newReserve);
    event StablecoinSet(address indexed stablecoin);

    // ─────────────────────────────────────────────────────────────────────────────
    // Erros (travas que o contrato verifica sozinho — seção 9.2)
    // ─────────────────────────────────────────────────────────────────────────────

    error InvalidAddress();
    error InvalidEmissionCap(uint256 cap);
    error InvalidValidity(uint64 validFrom, uint64 validUntil);
    error ZeroUnits();
    error RecipientNotHolder(address to);
    error WalletCapExceeded(address wallet, uint256 resultingBalance, uint256 maxPerWallet);
    error ReserveProtected(uint256 adminBalanceAfter, uint256 reservedUnits);
    error WalletRevoked(address wallet);
    error TokenExpired(uint64 validUntil);
    error AllPeriodsReported(uint8 totalPeriods);
    error PeriodNotReported(uint8 period);
    error PeriodNotOnChain(uint8 period);
    error PeriodOnChain(uint8 period);
    error NothingToClaim(uint8 period, address holder);
    error StablecoinAlreadySet(address current);
    error InvalidReserve(uint256 requested, uint256 current);
    error NothingToReissue(address wallet);
    error RenounceDisabled();

    // ─────────────────────────────────────────────────────────────────────────────
    // Emissão (única, no deploy — "Emitir leva", seção 9.1)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * @param admin        Carteira administrativa da IBITI: recebe toda a emissão (reserva + unidades à venda)
     *                     e é a única com permissão para as funções administrativas.
     * @param emissionCap_ Quantidade total de unidades da emissão (projeção: 150). Mínimo 15, para que as
     *                     frações do modelo (1/3 de reserva, 2/15 de teto) resultem em unidades inteiras.
     * @param validFrom_   Timestamp (UTC) de início do período de utilização off-chain.
     * @param validUntil_  Timestamp (UTC) de expiração: fim dos 4 anos da emissão.
     * @param stablecoin_  Endereço da stablecoin para pagamento on-chain do royalty, ou zero (liquidação fora da chain).
     */
    constructor(address admin, uint256 emissionCap_, uint64 validFrom_, uint64 validUntil_, address stablecoin_)
        ERC20("IBIToken", "IBT")
        Ownable(admin)
    {
        if (emissionCap_ < 15) revert InvalidEmissionCap(emissionCap_);
        if (validUntil_ <= validFrom_) revert InvalidValidity(validFrom_, validUntil_);

        emissionCap = emissionCap_;
        maxPerWallet = (emissionCap_ * 2) / 15; // 2 dos 15 pontos do royalty
        reservedUnits = emissionCap_ / 3; // 5 dos 15 pontos do royalty
        validFrom = validFrom_;
        validUntil = validUntil_;

        if (stablecoin_ != address(0)) {
            stablecoin = IERC20(stablecoin_);
            emit StablecoinSet(stablecoin_);
        }

        _mint(admin, emissionCap_);
        emit Emission(admin, emissionCap_, reservedUnits, maxPerWallet, validFrom_, validUntil_);
    }

    /// @notice Token indivisível: zero casas decimais. Quantidade de hospedagens é regra do cadastro externo.
    function decimals() public pure override returns (uint8) {
        return 0;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Funções administrativas (carteira administrativa da IBITI)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * @notice Compra primária: entrega `units` unidades a um apoiador que concluiu a verificação de
     * identidade fora da blockchain. É a única forma de uma carteira sem saldo entrar no ecossistema.
     * @param to      Carteira do apoiador verificado.
     * @param units   Quantidade de unidades inteiras.
     * @param saleRef Hash do registro da venda/verificação no sistema da IBITI (rastreabilidade sem dado pessoal).
     * @dev As travas (teto por carteira, reserva, validade, revogação, pausa) são aplicadas em `_update`.
     */
    function primaryPurchase(address to, uint256 units, bytes32 saleRef) external onlyOwner whenNotPaused {
        if (units == 0) revert ZeroUnits();
        _transfer(owner(), to, units);
        emit PrimaryPurchase(to, units, saleRef);
    }

    /**
     * @notice Reporta o faturamento bruto do semestre. O contrato calcula o royalty (15%), tira a fotografia
     * de saldos e registra o valor devido a cada carteira, pro-rata ao saldo (inclui a reserva da IBITI;
     * o uso de hospedagens não altera o saldo). Se a stablecoin estiver configurada, o total devido é
     * depositado neste contrato na mesma transação (a IBITI precisa ter aprovado o valor antes) e fica
     * disponível para saque por `claimRoyalty`.
     * @param grossRevenue Faturamento bruto do período (diárias + receitas adicionais), na unidade de conta
     *                     adotada: menor unidade da stablecoin quando configurada; centavos de real caso contrário.
     * @param reportHash   Hash do relatório financeiro que sustenta o valor (o relatório em si fica fora da chain).
     * @dev Custo limitado: o laço percorre no máximo `emissionCap` carteiras (cada uma tem >= 1 unidade).
     */
    function reportRevenue(uint256 grossRevenue, bytes32 reportHash) external onlyOwner whenNotPaused nonReentrant {
        if (lastReportedPeriod >= TOTAL_PERIODS) revert AllPeriodsReported(TOTAL_PERIODS);

        uint8 period = lastReportedPeriod + 1;
        lastReportedPeriod = period;

        uint256 royalty = (grossRevenue * ROYALTY_BPS) / BPS_DENOMINATOR;
        uint256 supply = totalSupply();
        uint256 walletCount = _holders.length;
        bool onChain = address(stablecoin) != address(0);

        uint256 totalDue;
        for (uint256 i = 0; i < walletCount; ++i) {
            address holder = _holders[i];
            uint256 due = (royalty * balanceOf(holder)) / supply;
            if (due == 0) continue;
            royaltyDue[period][holder] += due;
            totalDue += due;
            emit RoyaltyRegistered(period, holder, due);
        }

        _periods[period] = Period({
            grossRevenue: grossRevenue,
            royaltyAmount: royalty,
            totalDue: totalDue,
            snapshotSupply: supply,
            holderCount: walletCount,
            reportHash: reportHash,
            reportedAt: uint64(block.timestamp),
            onChain: onChain
        });

        if (onChain && totalDue > 0) {
            stablecoin.safeTransferFrom(_msgSender(), address(this), totalDue);
        }

        emit RevenueReported(period, grossRevenue, royalty, reportHash, supply, walletCount, onChain);
    }

    /**
     * @notice Registra a liquidação FORA da blockchain (pagamento em reais) do royalty de um portador,
     * em períodos reportados sem stablecoin. Mantém a trilha de auditoria completa on-chain.
     * @param paymentRef Hash do comprovante bancário / referência do pagamento.
     */
    function settleOffChain(uint8 period, address holder, bytes32 paymentRef) external onlyOwner whenNotPaused {
        if (period == 0 || period > lastReportedPeriod) revert PeriodNotReported(period);
        if (_periods[period].onChain) revert PeriodOnChain(period);

        uint256 amount = royaltyDue[period][holder];
        if (amount == 0) revert NothingToClaim(period, holder);

        royaltyDue[period][holder] = 0;
        royaltyPaid[period][holder] += amount;
        emit RoyaltySettledOffChain(period, holder, amount, paymentRef);
    }

    /**
     * @notice Reemissão por perda de chave ou sucessão: move todo o saldo e os royalties ainda não liquidados de `oldWallet` para `newWallet` e invalida a
     * carteira antiga, mediante processo administrativo fora da blockchain. Nunca existem dois saldos
     * válidos representando o mesmo direito.
     * @dev Implementada como queima + cunhagem de igual quantidade (supply inalterado): é literalmente uma
     *      reemissão, e não passa pelas regras de transferência entre portadores.
     */
    function reissue(address oldWallet, address newWallet) external onlyOwner whenNotPaused {
        if (newWallet == address(0) || newWallet == oldWallet || oldWallet == owner()) revert InvalidAddress();
        if (revoked[newWallet]) revert WalletRevoked(newWallet);

        uint256 units = balanceOf(oldWallet);
        if (units == 0) revert NothingToReissue(oldWallet);

        uint256 resulting = balanceOf(newWallet) + units;
        if (newWallet != owner() && resulting > maxPerWallet) revert WalletCapExceeded(newWallet, resulting, maxPerWallet);

        revoked[oldWallet] = true;

        for (uint8 p = 1; p <= lastReportedPeriod; ++p) {
            uint256 pending = royaltyDue[p][oldWallet];
            if (pending > 0) {
                royaltyDue[p][oldWallet] = 0;
                royaltyDue[p][newWallet] += pending;
            }
        }

        _burn(oldWallet, units);
        _mint(newWallet, units);
        emit Reissued(oldWallet, newWallet, units);
    }

    /**
     * @notice Reduz a reserva da IBITI (decisão expressa da administração — D8: "fora de venda salvo decisão
     * dela"). A reserva nunca pode ser aumentada: isso retiraria unidades já prometidas à venda.
     */
    function reduceReserve(uint256 newReserve) external onlyOwner {
        uint256 current = reservedUnits;
        if (newReserve >= current) revert InvalidReserve(newReserve, current);
        reservedUnits = newReserve;
        emit ReserveReduced(current, newReserve);
    }

    /// @notice Define a stablecoin de pagamento (uma única vez). Períodos reportados antes seguem liquidados fora da chain.
    function setStablecoin(address stablecoin_) external onlyOwner {
        if (stablecoin_ == address(0)) revert InvalidAddress();
        if (address(stablecoin) != address(0)) revert StablecoinAlreadySet(address(stablecoin));
        stablecoin = IERC20(stablecoin_);
        emit StablecoinSet(stablecoin_);
    }

    /// @notice Pausa de emergência: congela transferências, reportes e saques (incidente, ordem judicial).
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Retoma a operação.
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice A renúncia está desabilitada: sem administrador não há reporte nem reemissão.
    function renounceOwnership() public view override onlyOwner {
        revert RenounceDisabled();
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Portador: saque do royalty (jornada expert: a própria carteira; assistida: o custodiante)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * @notice Saca, em stablecoin, o royalty registrado para o chamador em um período reportado on-chain.
     * @dev Padrão pull: cada carteira saca o que lhe cabe; um endereço problemático não bloqueia os demais.
     */
    function claimRoyalty(uint8 period) external whenNotPaused nonReentrant {
        address holder = _msgSender();
        if (period == 0 || period > lastReportedPeriod) revert PeriodNotReported(period);
        if (!_periods[period].onChain) revert PeriodNotOnChain(period);
        if (revoked[holder]) revert WalletRevoked(holder);

        uint256 amount = royaltyDue[period][holder];
        if (amount == 0) revert NothingToClaim(period, holder);

        royaltyDue[period][holder] = 0;
        royaltyPaid[period][holder] += amount;
        stablecoin.safeTransfer(holder, amount);
        emit RoyaltyClaimed(period, holder, amount);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Consultas públicas ("Verificar acesso", seção 9.1 — usadas por parceiros do território)
    // ─────────────────────────────────────────────────────────────────────────────

    /// @notice True depois do fim dos 4 anos: as três faces do token se extinguem (o registro fica como histórico).
    function isExpired() public view returns (bool) {
        return block.timestamp > validUntil;
    }

    /// @notice Passaporte IBITI: quem tem saldo, não foi revogado e está dentro da validade é membro.
    function isMember(address account) public view returns (bool) {
        return balanceOf(account) > 0 && !revoked[account] && !isExpired();
    }

    /**
     * @notice Consulta única para liberação de benefícios: saldo total,
     * condição de membro e situação de validade. Hospedagens ficam no cadastro externo. Não expõe nenhum dado pessoal.
     */
    function accessInfo(address account)
        external
        view
        returns (uint256 balance, bool member, bool expired)
    {
        balance = balanceOf(account);
        member = isMember(account);
        expired = isExpired();
    }

    /// @notice Unidades que a carteira administrativa ainda pode vender sem tocar na reserva.
    function saleableUnits() external view returns (uint256) {
        uint256 adminBalance = balanceOf(owner());
        return adminBalance > reservedUnits ? adminBalance - reservedUnits : 0;
    }

    /// @notice Carteiras com saldo > 0 (a fotografia usada nas distribuições).
    function holders() external view returns (address[] memory) {
        return _holders;
    }

    function holderCount() external view returns (uint256) {
        return _holders.length;
    }

    /// @notice Dados de um período reportado.
    function periodInfo(uint8 period) external view returns (Period memory) {
        if (period == 0 || period > lastReportedPeriod) revert PeriodNotReported(period);
        return _periods[period];
    }

    /// @notice Soma do royalty ainda não liquidado de uma carteira em todos os períodos reportados.
    function pendingRoyaltyOf(address account) external view returns (uint256 total) {
        for (uint8 p = 1; p <= lastReportedPeriod; ++p) {
            total += royaltyDue[p][account];
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Núcleo: travas de transferência (seção 9.2 / 10.3)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * @dev Toda movimentação passa por aqui (ERC-20 + pausa). Para transferências entre carteiras:
     *      1. validade: rejeita depois de `validUntil`;
     *      2. revogação: origem e destino não podem estar invalidados por reemissão;
     *      3. porta de entrada: destino sem saldo só recebe da carteira administrativa (compra primária);
     *         a carteira administrativa sempre pode receber (ex.: devolução, troca de administrador);
     *      4. teto por carteira: 2/15 do supply, exceto a carteira administrativa (reserva);
     *      5. reserva: a carteira administrativa não desce abaixo de `reservedUnits`;
     *      Cunhagem (deploy, reemissão) e queima (reemissão) não passam pelas regras 1–5.
     */
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        if (from != address(0) && to != address(0) && from != to) {
            _enforceTransferRules(from, to, value);
        }

        super._update(from, to, value);

        if (from != address(0)) _syncHolder(from);
        if (to != address(0)) _syncHolder(to);
    }

    function _enforceTransferRules(address from, address to, uint256 value) private view {
        if (block.timestamp > validUntil) revert TokenExpired(validUntil);
        if (revoked[from]) revert WalletRevoked(from);
        if (revoked[to]) revert WalletRevoked(to);

        address admin = owner();
        uint256 toBalance = balanceOf(to);

        if (to != admin) {
            if (from != admin && toBalance == 0) revert RecipientNotHolder(to);
            if (toBalance + value > maxPerWallet) revert WalletCapExceeded(to, toBalance + value, maxPerWallet);
        }

        if (from == admin) {
            uint256 fromBalance = balanceOf(from);
            // saldo insuficiente é tratado pelo ERC-20 (ERC20InsufficientBalance); aqui só a reserva
            if (fromBalance >= value && fromBalance - value < reservedUnits) {
                revert ReserveProtected(fromBalance - value, reservedUnits);
            }
        }
    }

    function _syncHolder(address account) private {
        uint256 balance = balanceOf(account);
        uint256 index = _holderIndex[account];

        if (balance > 0 && index == 0) {
            _holders.push(account);
            _holderIndex[account] = _holders.length;
        } else if (balance == 0 && index != 0) {
            uint256 lastIndex = _holders.length;
            if (index != lastIndex) {
                address moved = _holders[lastIndex - 1];
                _holders[index - 1] = moved;
                _holderIndex[moved] = index;
            }
            _holders.pop();
            _holderIndex[account] = 0;
        }
    }
}
