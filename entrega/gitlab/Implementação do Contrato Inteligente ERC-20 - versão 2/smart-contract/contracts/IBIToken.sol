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
 * @dev Versão técnica 3 (Parte 2 acadêmica): identidade civil e hospedagens ficam off-chain;
 * vínculo opaco e teto por pessoa são exigidos on-chain.
 * Não há marcação de resgate, IDs por unidade nem queima por hospedagem neste contrato.
 * O token usa componentes OpenZeppelin 5.6.1. Administração em dois passos, pausa,
 * tesouraria separada, teto por pessoa, calendário civil e recuperação com espera de 48 horas.
 * Os contratos publicados em 11/09/2026 são históricos; esta revisão exige novo deploy.
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

    /// @notice Teto da emissão única (projeção do whitepaper: 150 unidades). Não há aumento da oferta após o deploy; recuperação apenas recompõe saldo.
    uint256 public immutable emissionCap;

    /// @notice Teto de 20 por carteira E por pessoa (2/15 do supply); somente a tesouraria é isenta.
    uint256 public immutable maxPerWallet;

    /// @notice Estoque e reserva pertencem à tesouraria, independentemente de trocas de owner.
    address public immutable treasury;
    uint256 public constant RECOVERY_DELAY = 48 hours;
    /// @notice Mesma pessoa usa o mesmo identificador aleatório, nunca CPF ou hash simples de CPF.
    mapping(address => bytes32) public personOf;
    mapping(bytes32 => uint256) public personBalance;
    uint64[8] private _periodEnds;
    uint256 public primaryUnitPrice;
    bool private _primaryDelivery;

    struct Recovery { address destination; address proposer; uint64 executeAfter; bytes32 caseHash; }
    mapping(address => Recovery) public recoveries;
    mapping(address => address) public recoverySource;
    /// @notice Geração administrativa impede reativar anúncios quando um ex-owner reassume.
    uint256 public ownershipEpoch;
    mapping(address => uint256) public recoveryEpoch;

    /// @notice Início do período de utilização, consultado pelo serviço off-chain.
    uint64 public immutable validFrom;

    /// @notice Fim da validade: depois desta data o contrato rejeita transferências.
    uint64 public immutable validUntil;

    // ─────────────────────────────────────────────────────────────────────────────
    // Estado
    // ─────────────────────────────────────────────────────────────────────────────

    /// @notice Unidades que a tesouraria deve manter (reserva da IBITI = 5 dos 15 pontos
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
    event WalletRegistered(address indexed wallet, bytes32 indexed personId);
    event RecoveryRequested(address indexed oldWallet, address indexed newWallet, uint64 executeAfter, bytes32 caseHash);
    event RecoveryCancelled(address indexed oldWallet, address indexed newWallet);
    event PrimaryPriceSet(uint256 unitPrice);
    event PrimaryPayment(address indexed buyer, uint256 amount);
    event RoyaltyRecovered(uint8 indexed period, address indexed oldWallet, address indexed newWallet, uint256 amount);

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
    error WalletNotRegistered(address wallet);
    error WalletAlreadyRegistered(address wallet);
    error PersonCapExceeded(bytes32 personId, uint256 resultingBalance, uint256 maximum);
    error PeriodNotClosed(uint8 period, uint64 closesAt);
    error InvalidPeriod(uint8 period);
    error InvalidRecovery();
    error RecoveryPending(address wallet);
    error RecoveryNotReady(uint64 executeAfter);
    error RecoveryCancellationUnauthorized();
    error PrimaryPurchaseRequired();
    error StablecoinPurchaseRequired();
    error PrimaryPriceUnavailable();
    error PrimaryPriceAlreadySet();
    error IncorrectPayment();

    // ─────────────────────────────────────────────────────────────────────────────
    // Emissão (única, no deploy — "Emitir leva", seção 9.1)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * @param admin        Carteira administrativa da IBITI: recebe toda a emissão (reserva + unidades à venda)
     *                     e é a única com permissão para as funções administrativas.
     * @param emissionCap_ Quantidade total da emissão: obrigatoriamente 150 neste piloto.
     * @param validFrom_   Timestamp UTC de 1º de janeiro, entre 1970 e 2100; piloto: 01/01/2027.
     * @param validUntil_  Último segundo UTC do quarto ano civil; piloto: 31/12/2030 23:59:59.
     * @param stablecoin_  Endereço da stablecoin para pagamento on-chain do royalty, ou zero (liquidação fora da chain).
     */
    constructor(address admin, uint256 emissionCap_, uint64 validFrom_, uint64 validUntil_, address stablecoin_)
        ERC20("IBIToken", "IBT")
        Ownable(admin)
    {
        if (emissionCap_ != 150) revert InvalidEmissionCap(emissionCap_);
        if (validUntil_ <= validFrom_) revert InvalidValidity(validFrom_, validUntil_);

        _configureCalendar(validFrom_, validUntil_);
        treasury = admin;
        emissionCap = emissionCap_;
        maxPerWallet = (emissionCap_ * 2) / 15; // 2 dos 15 pontos do royalty
        reservedUnits = emissionCap_ / 3; // 5 dos 15 pontos do royalty
        validFrom = validFrom_;
        validUntil = validUntil_;

        if (stablecoin_ != address(0)) {
            if (stablecoin_.code.length == 0) revert InvalidAddress();
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

    /// @notice Registra a verificação externa. O vínculo nunca pode ser reatribuído pelo administrador.
    function registerWallet(address wallet, bytes32 personId) external onlyOwner whenNotPaused {
        if (wallet == address(0) || wallet == treasury || wallet == address(this) || personId == bytes32(0)) revert InvalidAddress();
        if (revoked[wallet]) revert WalletRevoked(wallet);
        if (recoverySource[wallet] != address(0)) revert RecoveryPending(wallet);
        if (personOf[wallet] != bytes32(0)) revert WalletAlreadyRegistered(wallet);
        personOf[wallet] = personId;
        emit WalletRegistered(wallet, personId);
    }

    /// @notice Preço na menor unidade da stablecoin, fixado uma única vez antes da compra atômica.
    function setPrimaryPrice(uint256 unitPrice) external onlyOwner {
        if (primaryUnitPrice != 0) revert PrimaryPriceAlreadySet();
        if (unitPrice == 0) revert PrimaryPriceUnavailable();
        primaryUnitPrice = unitPrice;
        emit PrimaryPriceSet(unitPrice);
    }

    /// @notice Liquidação externa: entrega administrativa apenas quando NÃO há stablecoin configurada.
    /// @dev Pagamento fiat continua dependente de comprovação externa. Não existe esta via no modo stablecoin.
    function primaryPurchase(address to, uint256 units, bytes32 saleRef) external onlyOwner whenNotPaused {
        if (address(stablecoin) != address(0)) revert StablecoinPurchaseRequired();
        _deliverPrimary(to, units);
        emit PrimaryPurchase(to, units, saleRef);
    }

    /// @notice Comprador previamente registrado paga e recebe IBT na mesma transação.
    /// @dev Preço é fixo; aprovação ERC-20 prévia autoriza somente o valor da compra.
    function buyPrimary(uint256 units, bytes32 saleRef) external whenNotPaused nonReentrant {
        if (address(stablecoin) == address(0) || primaryUnitPrice == 0) revert PrimaryPriceUnavailable();
        address buyer = _msgSender();
        uint256 payment = units * primaryUnitPrice;
        _deliverPrimary(buyer, units);
        uint256 beforeBalance = stablecoin.balanceOf(treasury);
        stablecoin.safeTransferFrom(buyer, treasury, payment);
        if (stablecoin.balanceOf(treasury) - beforeBalance != payment) revert IncorrectPayment();
        emit PrimaryPayment(buyer, payment);
        emit PrimaryPurchase(buyer, units, saleRef);
    }

    function _deliverPrimary(address to, uint256 units) private {
        if (units == 0) revert ZeroUnits();
        if (to == treasury || to == address(this)) revert InvalidAddress();
        _primaryDelivery = true;
        _transfer(treasury, to, units);
        _primaryDelivery = false;
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
        if (block.timestamp < periodEnd(period)) revert PeriodNotClosed(period, periodEnd(period));
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
            uint256 beforeBalance = stablecoin.balanceOf(address(this));
            stablecoin.safeTransferFrom(_msgSender(), address(this), totalDue);
            if (stablecoin.balanceOf(address(this)) - beforeBalance != totalDue) revert IncorrectPayment();
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

        if (recoveries[holder].executeAfter != 0) revert RecoveryPending(holder);
        uint256 amount = royaltyDue[period][holder];
        if (amount == 0) revert NothingToClaim(period, holder);

        royaltyDue[period][holder] = 0;
        royaltyPaid[period][holder] += amount;
        emit RoyaltySettledOffChain(period, holder, amount, paymentRef);
    }

    /// @notice Anuncia recuperação de acesso da MESMA pessoa. Não é transferência de titularidade por sucessão.
    /// @dev Congela origem e reserva destino por 48 horas; o titular pode contestar cancelando na cadeia.
    function requestRecovery(address oldWallet, address newWallet, bytes32 caseHash) external onlyOwner whenNotPaused {
        if (caseHash == bytes32(0)) revert InvalidRecovery();
        _validateRecovery(oldWallet, newWallet);
        if (recoveries[oldWallet].executeAfter != 0 || recoverySource[oldWallet] != address(0)) revert RecoveryPending(oldWallet);
        if (recoverySource[newWallet] != address(0)) revert RecoveryPending(newWallet);
        if (balanceOf(oldWallet) == 0 && pendingRoyaltyOf(oldWallet) == 0) revert NothingToReissue(oldWallet);
        uint64 eta = uint64(block.timestamp + RECOVERY_DELAY);
        recoveries[oldWallet] = Recovery(newWallet, owner(), eta, caseHash);
        recoverySource[newWallet] = oldWallet;
        recoveryEpoch[oldWallet] = ownershipEpoch;
        emit RecoveryRequested(oldWallet, newWallet, eta, caseHash);
    }

    /// @notice Contestação/cancelamento disponível mesmo durante pausa e após troca do administrador.
    function cancelRecovery(address oldWallet) external {
        if (_msgSender() != owner() && _msgSender() != oldWallet) revert RecoveryCancellationUnauthorized();
        Recovery memory request = recoveries[oldWallet];
        if (request.executeAfter == 0) revert InvalidRecovery();
        delete recoverySource[request.destination];
        delete recoveries[oldWallet];
        delete recoveryEpoch[oldWallet];
        emit RecoveryCancelled(oldWallet, request.destination);
    }

    /// @notice Executa anúncio maduro, inclusive após expiração ou com saldo zero e royalties pendentes.
    /// @dev Troca de owner invalida a autorização antiga: cancelar e anunciar novamente com novo prazo.
    function reissue(address oldWallet, address newWallet) external onlyOwner whenNotPaused {
        _validateRecovery(oldWallet, newWallet);
        Recovery memory request = recoveries[oldWallet];
        if (request.destination != newWallet || request.executeAfter == 0 || request.proposer != owner() || recoveryEpoch[oldWallet] != ownershipEpoch) revert InvalidRecovery();
        if (block.timestamp < request.executeAfter) revert RecoveryNotReady(request.executeAfter);
        delete recoveries[oldWallet];
        delete recoveryEpoch[oldWallet];
        delete recoverySource[newWallet];
        bytes32 personId = personOf[oldWallet];
        if (personOf[newWallet] == bytes32(0)) {
            personOf[newWallet] = personId;
            emit WalletRegistered(newWallet, personId);
        }
        uint256 units = balanceOf(oldWallet);
        revoked[oldWallet] = true;
        for (uint8 p = 1; p <= lastReportedPeriod; ++p) {
            uint256 pending = royaltyDue[p][oldWallet];
            if (pending > 0) {
                royaltyDue[p][oldWallet] = 0;
                royaltyDue[p][newWallet] += pending;
                emit RoyaltyRecovered(p, oldWallet, newWallet, pending);
            }
        }
        if (units > 0) {
            _burn(oldWallet, units);
            _mint(newWallet, units);
        }
        emit Reissued(oldWallet, newWallet, units);
    }

    function _validateRecovery(address oldWallet, address newWallet) private view {
        if (oldWallet == treasury || newWallet == treasury || newWallet == owner() || newWallet == pendingOwner()
            || newWallet == address(0) || newWallet.code.length != 0 || oldWallet == newWallet) revert InvalidAddress();
        if (revoked[oldWallet]) revert WalletRevoked(oldWallet);
        if (revoked[newWallet]) revert WalletRevoked(newWallet);
        bytes32 personId = personOf[oldWallet];
        if (personId == bytes32(0)) revert WalletNotRegistered(oldWallet);
        if (balanceOf(newWallet) != 0 || pendingRoyaltyOf(newWallet) != 0 || recoveries[newWallet].executeAfter != 0
            || (personOf[newWallet] != bytes32(0) && personOf[newWallet] != personId)) revert InvalidRecovery();
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
        if (stablecoin_.code.length == 0) revert InvalidAddress();
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

    function _transferOwnership(address newOwner) internal override {
        super._transferOwnership(newOwner);
        ++ownershipEpoch;
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

        if (recoveries[holder].executeAfter != 0) revert RecoveryPending(holder);
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

    /// @notice True após validade de circulação/uso. Recebíveis, saques e recuperação continuam preservados.
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

    /// @notice Unidades que a tesouraria ainda pode vender sem tocar na reserva.
    function saleableUnits() external view returns (uint256) {
        uint256 adminBalance = balanceOf(treasury);
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
    function pendingRoyaltyOf(address account) public view returns (uint256 total) {
        for (uint8 p = 1; p <= lastReportedPeriod; ++p) {
            total += royaltyDue[p][account];
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Núcleo: travas de transferência (seção 9.2 / 10.3)
    // ─────────────────────────────────────────────────────────────────────────────

    /// @dev Regras comuns a transfer/transferFrom/compra; autoenvio também respeita pausa/expiração/revogação.
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        if (from != address(0) && to != address(0)) _enforceTransferRules(from, to, value);
        super._update(from, to, value);
        bytes32 sourcePerson = personOf[from];
        bytes32 targetPerson = personOf[to];
        if (sourcePerson != targetPerson) {
            if (sourcePerson != bytes32(0)) personBalance[sourcePerson] -= value;
            if (targetPerson != bytes32(0)) personBalance[targetPerson] += value;
        }
        if (from != address(0)) _syncHolder(from);
        if (to != address(0)) _syncHolder(to);
    }

    function _enforceTransferRules(address from, address to, uint256 value) private view {
        if (block.timestamp > validUntil) revert TokenExpired(validUntil);
        if (revoked[from]) revert WalletRevoked(from);
        if (revoked[to]) revert WalletRevoked(to);
        if (recoveries[from].executeAfter != 0 || recoverySource[from] != address(0)) revert RecoveryPending(from);
        if (recoveries[to].executeAfter != 0 || recoverySource[to] != address(0)) revert RecoveryPending(to);
        if (from == to) return;
        if (from == treasury && !_primaryDelivery) revert PrimaryPurchaseRequired();
        if (to == address(this)) revert InvalidAddress();
        if (to != treasury) {
            bytes32 personId = personOf[to];
            if (personId == bytes32(0)) revert WalletNotRegistered(to);
            uint256 toBalance = balanceOf(to);
            if (from != treasury && toBalance == 0) revert RecipientNotHolder(to);
            if (toBalance + value > maxPerWallet) revert WalletCapExceeded(to, toBalance + value, maxPerWallet);
            if (personOf[from] != personId && personBalance[personId] + value > maxPerWallet)
                revert PersonCapExceeded(personId, personBalance[personId] + value, maxPerWallet);
        }
        if (from == treasury) {
            uint256 fromBalance = balanceOf(from);
            if (fromBalance >= value && fromBalance - value < reservedUnits) revert ReserveProtected(fromBalance - value, reservedUnits);
        }
    }

    /// @notice Primeiro instante UTC após o semestre: 1º de julho ou 1º de janeiro seguinte.
    function periodEnd(uint8 period) public view returns (uint64) {
        if (period == 0 || period > TOTAL_PERIODS) revert InvalidPeriod(period);
        return _periodEnds[period - 1];
    }

    /// @dev Calendário civil de quatro anos. Limite 1970–2100 evita laço aberto com entrada arbitrária.
    function _configureCalendar(uint64 from, uint64 until) private {
        uint256 year = 1970;
        uint256 cursor;
        while (year < 2101 && cursor < from) {
            cursor += uint256(_leap(year) ? 366 : 365) * 1 days;
            ++year;
        }
        if (cursor != from || year > 2100) revert InvalidValidity(from, until);
        for (uint8 i = 0; i < 4; ++i) {
            bool leap = _leap(year + i);
            _periodEnds[i * 2] = uint64(cursor + uint256(leap ? 182 : 181) * 1 days);
            cursor += uint256(leap ? 366 : 365) * 1 days;
            _periodEnds[i * 2 + 1] = uint64(cursor);
        }
        if (cursor - 1 != until) revert InvalidValidity(from, until);
    }

    function _leap(uint256 year) private pure returns (bool) {
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
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
