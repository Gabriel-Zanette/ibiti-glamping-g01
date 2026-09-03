import { expect } from "chai";
import { network } from "hardhat";

/**
 * Testes funcionais do IBIToken (Hardhat 3 · mocha · ethers v6).
 * Cada bloco corresponde a uma regra de negócio do whitepaper (seção 9) traduzida em regra computacional.
 * Personas usadas nos cenários: Helena (hóspede AAA, jornada assistida via custodiante),
 * Beatriz (investidora de impacto), Gabriel (cripto-nativo, jornada expert).
 */
const { ethers, networkHelpers } = await network.create();
const { loadFixture, time } = networkHelpers;

const CAP = 150n;
const RESERVE = 50n; // 1/3 do supply
const MAX_PER_WALLET = 20n; // 2/15 do supply
const FOUR_YEARS = 1461n * 24n * 60n * 60n;
const ROYALTY_BPS = 1500n;

const ref = (s: string) => ethers.keccak256(ethers.toUtf8Bytes(s));
const brl = (v: string) => ethers.parseUnits(v, 6); // stablecoin de teste com 6 casas
const GROSS_2027 = brl("6797476.76"); // faturamento bruto 2027 do whitepaper (seção 4.2), usado como semestre ilustrativo
const royaltyOf = (gross: bigint) => (gross * ROYALTY_BPS) / 10_000n;
const dueOf = (gross: bigint, balance: bigint) => (royaltyOf(gross) * balance) / CAP;

async function deployFixture() {
  const [admin, helena, beatriz, gabriel, custodian, outsider, heir, newAdmin] = await ethers.getSigners();
  const stable = await ethers.deployContract("MockStablecoin", ["Stablecoin de Teste", "tBRL", 6]);
  const validFrom = BigInt(await time.latest());
  const validUntil = validFrom + FOUR_YEARS;
  const token = await ethers.deployContract("IBIToken", [
    admin.address,
    CAP,
    validFrom,
    validUntil,
    await stable.getAddress(),
  ]);
  // a IBITI (admin) mantém stablecoin suficiente e aprova o contrato para os depósitos de royalty
  await stable.mint(admin.address, brl("100000000"));
  await stable.connect(admin).approve(await token.getAddress(), ethers.MaxUint256);
  return { token, stable, admin, helena, beatriz, gabriel, custodian, outsider, heir, newAdmin, validFrom, validUntil };
}

async function deployOffChainFixture() {
  const [admin, helena, beatriz, gabriel, custodian, outsider, heir] = await ethers.getSigners();
  const validFrom = BigInt(await time.latest());
  const validUntil = validFrom + FOUR_YEARS;
  const token = await ethers.deployContract("IBIToken", [admin.address, CAP, validFrom, validUntil, ethers.ZeroAddress]);
  const stable = await ethers.deployContract("MockStablecoin", ["Stablecoin de Teste", "tBRL", 6]);
  return { token, stable, admin, helena, beatriz, gabriel, custodian, outsider, heir, validFrom, validUntil };
}

/** Cenário padrão de mercado: Helena 20, Beatriz 10, Gabriel 5 (admin fica com 115 = 50 de reserva + 65 à venda). */
async function marketFixture() {
  const f = await deployFixture();
  await f.token.primaryPurchase(f.helena.address, 20n, ref("venda-helena"));
  await f.token.primaryPurchase(f.beatriz.address, 10n, ref("venda-beatriz"));
  await f.token.primaryPurchase(f.gabriel.address, 5n, ref("venda-gabriel"));
  return f;
}

describe("IBIToken", function () {
  // ───────────────────────────────────────────────────────────────────────────
  describe("Emissão única (deploy)", function () {
    it("tem nome IBIToken, símbolo IBT e zero casas decimais (token indivisível)", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.name()).to.equal("IBIToken");
      expect(await token.symbol()).to.equal("IBT");
      expect(await token.decimals()).to.equal(0n);
    });

    it("cunha todo o supply (150) na carteira administrativa, com reserva 50 e teto 20 por carteira", async function () {
      const { token, admin, validFrom, validUntil } = await loadFixture(deployFixture);
      expect(await token.totalSupply()).to.equal(CAP);
      expect(await token.balanceOf(admin.address)).to.equal(CAP);
      expect(await token.emissionCap()).to.equal(CAP);
      expect(await token.reservedUnits()).to.equal(RESERVE);
      expect(await token.maxPerWallet()).to.equal(MAX_PER_WALLET);
      expect(await token.saleableUnits()).to.equal(CAP - RESERVE);
      expect(await token.validFrom()).to.equal(validFrom);
      expect(await token.validUntil()).to.equal(validUntil);
      expect(await token.owner()).to.equal(admin.address);
      expect(await token.holderCount()).to.equal(1n);
      expect(await token.isMember(admin.address)).to.equal(true);
    });

    it("emite o evento Emission com os parâmetros da emissão", async function () {
      const [admin] = await ethers.getSigners();
      const validFrom = BigInt(await time.latest());
      const validUntil = validFrom + FOUR_YEARS;
      const token = await ethers.deployContract("IBIToken", [admin.address, CAP, validFrom, validUntil, ethers.ZeroAddress]);
      const receipt = await token.deploymentTransaction()!.wait();
      const parsed = receipt!.logs
        .map((log) => { try { return token.interface.parseLog(log); } catch { return null; } })
        .find((l) => l?.name === "Emission");
      expect(parsed).to.not.equal(undefined);
      expect(parsed!.args.admin).to.equal(admin.address);
      expect(parsed!.args.emissionCap).to.equal(CAP);
      expect(parsed!.args.reservedUnits).to.equal(RESERVE);
      expect(parsed!.args.maxPerWallet).to.equal(MAX_PER_WALLET);
    });

    it("não existe função de mint nem de burn na interface pública", async function () {
      const { token } = await loadFixture(deployFixture);
      const names = token.interface.fragments
        .filter((f) => f.type === "function")
        .map((f) => (f as unknown as { name: string }).name);
      expect(names).to.not.include.members(["mint", "burn", "burnFrom"]);
      expect(names).to.include.members(["primaryPurchase", "markRedeemed", "reportRevenue", "claimRoyalty", "reissue"]);
    });

    it("rejeita parâmetros inválidos no deploy", async function () {
      const { token, admin, validFrom, validUntil } = await loadFixture(deployFixture);
      await expect(ethers.deployContract("IBIToken", [admin.address, 14n, validFrom, validUntil, ethers.ZeroAddress]))
        .to.be.revertedWithCustomError(token, "InvalidEmissionCap").withArgs(14n);
      await expect(ethers.deployContract("IBIToken", [admin.address, CAP, validFrom, validFrom, ethers.ZeroAddress]))
        .to.be.revertedWithCustomError(token, "InvalidValidity").withArgs(validFrom, validFrom);
      await expect(ethers.deployContract("IBIToken", [ethers.ZeroAddress, CAP, validFrom, validUntil, ethers.ZeroAddress]))
        .to.be.revertedWithCustomError(token, "OwnableInvalidOwner").withArgs(ethers.ZeroAddress);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Compra primária (porta de entrada única)", function () {
    it("entrega unidades a uma carteira verificada e registra a venda", async function () {
      const { token, admin, helena } = await loadFixture(deployFixture);
      const saleRef = ref("kyc-helena-2026-09");
      await expect(token.primaryPurchase(helena.address, 5n, saleRef))
        .to.emit(token, "PrimaryPurchase").withArgs(helena.address, 5n, saleRef)
        .and.to.emit(token, "Transfer").withArgs(admin.address, helena.address, 5n)
        .and.to.emit(token, "UnitsMoved").withArgs(admin.address, helena.address, 5n, 0n);
      expect(await token.balanceOf(helena.address)).to.equal(5n);
      expect(await token.activeUnitsOf(helena.address)).to.equal(5n);
      expect(await token.isMember(helena.address)).to.equal(true);
      expect(await token.holders()).to.deep.equal([admin.address, helena.address]);
      expect(await token.saleableUnits()).to.equal(95n);
    });

    it("só a carteira administrativa pode executar a compra primária", async function () {
      const { token, helena, beatriz } = await loadFixture(deployFixture);
      await expect(token.connect(helena).primaryPurchase(beatriz.address, 1n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount").withArgs(helena.address);
    });

    it("rejeita quantidade zero", async function () {
      const { token, helena } = await loadFixture(deployFixture);
      await expect(token.primaryPurchase(helena.address, 0n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "ZeroUnits");
    });

    it("aplica o teto de 20 unidades por carteira (2/15 do supply)", async function () {
      const { token, helena } = await loadFixture(deployFixture);
      await expect(token.primaryPurchase(helena.address, 21n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "WalletCapExceeded").withArgs(helena.address, 21n, MAX_PER_WALLET);
      await token.primaryPurchase(helena.address, 20n, ethers.ZeroHash);
      await expect(token.primaryPurchase(helena.address, 1n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "WalletCapExceeded").withArgs(helena.address, 21n, MAX_PER_WALLET);
    });

    it("protege a reserva da IBITI: no máximo 100 unidades vão a mercado", async function () {
      const { token, helena, beatriz, gabriel, custodian, outsider } = await loadFixture(deployFixture);
      for (const buyer of [helena, beatriz, gabriel, custodian, outsider]) {
        await token.primaryPurchase(buyer.address, 20n, ethers.ZeroHash);
      }
      expect(await token.saleableUnits()).to.equal(0n);
      await expect(token.primaryPurchase(helena.address, 1n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "WalletCapExceeded"); // helena já está no teto
      const [, , , , , , heir] = await ethers.getSigners();
      await expect(token.primaryPurchase(heir.address, 1n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "ReserveProtected").withArgs(49n, RESERVE);
    });

    it("a reserva só pode ser reduzida por decisão expressa (nunca aumentada)", async function () {
      const { token, helena, beatriz, gabriel, custodian, outsider, heir } = await loadFixture(deployFixture);
      for (const buyer of [helena, beatriz, gabriel, custodian, outsider]) {
        await token.primaryPurchase(buyer.address, 20n, ethers.ZeroHash);
      }
      await expect(token.reduceReserve(60n)).to.be.revertedWithCustomError(token, "InvalidReserve").withArgs(60n, RESERVE);
      await expect(token.reduceReserve(40n)).to.emit(token, "ReserveReduced").withArgs(RESERVE, 40n);
      expect(await token.saleableUnits()).to.equal(10n);
      await token.primaryPurchase(heir.address, 10n, ethers.ZeroHash);
      expect(await token.balanceOf(heir.address)).to.equal(10n);
      await expect(token.connect(helena).reduceReserve(30n)).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("a transferência direta da carteira administrativa obedece às mesmas travas", async function () {
      const { token, admin, helena } = await loadFixture(deployFixture);
      await token.connect(admin).transfer(helena.address, 3n); // porta de entrada: origem é a administrativa
      expect(await token.balanceOf(helena.address)).to.equal(3n);
      await expect(token.connect(admin).transfer(helena.address, 18n))
        .to.be.revertedWithCustomError(token, "WalletCapExceeded").withArgs(helena.address, 21n, MAX_PER_WALLET);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Transferências entre portadores", function () {
    it("permite transferir para quem já tem saldo (portador verificado)", async function () {
      const { token, helena, beatriz } = await loadFixture(marketFixture);
      await expect(token.connect(helena).transfer(beatriz.address, 3n))
        .to.emit(token, "Transfer").withArgs(helena.address, beatriz.address, 3n)
        .and.to.emit(token, "UnitsMoved").withArgs(helena.address, beatriz.address, 3n, 0n);
      expect(await token.balanceOf(helena.address)).to.equal(17n);
      expect(await token.balanceOf(beatriz.address)).to.equal(13n);
    });

    it("rejeita transferência para carteira sem saldo (não verificada)", async function () {
      const { token, helena, outsider } = await loadFixture(marketFixture);
      await expect(token.connect(helena).transfer(outsider.address, 1n))
        .to.be.revertedWithCustomError(token, "RecipientNotHolder").withArgs(outsider.address);
    });

    it("transferFrom (custodiante autorizado) segue as mesmas regras", async function () {
      const { token, helena, beatriz, custodian, outsider } = await loadFixture(marketFixture);
      await token.connect(helena).approve(custodian.address, 10n);
      await token.connect(custodian).transferFrom(helena.address, beatriz.address, 4n);
      expect(await token.balanceOf(beatriz.address)).to.equal(14n);
      await expect(token.connect(custodian).transferFrom(helena.address, outsider.address, 1n))
        .to.be.revertedWithCustomError(token, "RecipientNotHolder").withArgs(outsider.address);
    });

    it("aplica o teto por carteira também no mercado secundário", async function () {
      const { token, helena, beatriz } = await loadFixture(marketFixture);
      await expect(token.connect(beatriz).transfer(helena.address, 1n))
        .to.be.revertedWithCustomError(token, "WalletCapExceeded").withArgs(helena.address, 21n, MAX_PER_WALLET);
    });

    it("permite devolver unidades à carteira administrativa (isenta do teto)", async function () {
      const { token, admin, helena } = await loadFixture(marketFixture);
      await token.connect(helena).transfer(admin.address, 20n);
      expect(await token.balanceOf(admin.address)).to.equal(135n);
      expect(await token.balanceOf(helena.address)).to.equal(0n);
      expect(await token.isMember(helena.address)).to.equal(false);
      expect(await token.holders()).to.not.include(helena.address);
    });

    it("saldo insuficiente reverte com o erro padrão do ERC-20", async function () {
      const { token, gabriel, beatriz } = await loadFixture(marketFixture);
      await expect(token.connect(gabriel).transfer(beatriz.address, 6n))
        .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance").withArgs(gabriel.address, 5n, 6n);
    });

    it("mantém o registro de portadores coerente com os saldos", async function () {
      const { token, admin, helena, beatriz, gabriel } = await loadFixture(marketFixture);
      expect(await token.holders()).to.deep.equal([admin.address, helena.address, beatriz.address, gabriel.address]);
      await token.connect(helena).transfer(beatriz.address, 10n);
      await token.connect(helena).transfer(gabriel.address, 10n); // helena zera
      const holders = await token.holders();
      expect(holders).to.have.length(3);
      expect(holders).to.not.include(helena.address);
      expect(holders).to.include(gabriel.address);
      await token.primaryPurchase(helena.address, 1n, ethers.ZeroHash); // volta pela porta de entrada
      expect(await token.holders()).to.include(helena.address);
      expect(await token.holderCount()).to.equal(4n);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Resgate da experiência (marcação sem queima)", function () {
    it("move unidades de ativas para resgatadas sem alterar saldo nem supply", async function () {
      const { token, helena } = await loadFixture(marketFixture);
      const voucher = ref("voucher-0001");
      await expect(token.markRedeemed(helena.address, 2n, voucher))
        .to.emit(token, "RedemptionMarked").withArgs(helena.address, 2n, voucher, 18n);
      expect(await token.balanceOf(helena.address)).to.equal(20n);
      expect(await token.activeUnitsOf(helena.address)).to.equal(18n);
      expect(await token.redeemedUnitsOf(helena.address)).to.equal(2n);
      expect(await token.totalSupply()).to.equal(CAP);
      const info = await token.accessInfo(helena.address);
      expect(info.balance).to.equal(20n);
      expect(info.active).to.equal(18n);
      expect(info.redeemed).to.equal(2n);
      expect(info.member).to.equal(true);
      expect(info.expired).to.equal(false);
    });

    it("rejeita resgatar mais unidades do que as ativas (resgate único por unidade)", async function () {
      const { token, gabriel } = await loadFixture(marketFixture);
      await token.markRedeemed(gabriel.address, 3n, ethers.ZeroHash);
      await expect(token.markRedeemed(gabriel.address, 3n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "InsufficientActiveUnits").withArgs(gabriel.address, 2n, 3n);
    });

    it("só a carteira administrativa marca resgates, e nunca zero unidades", async function () {
      const { token, helena } = await loadFixture(marketFixture);
      await expect(token.connect(helena).markRedeemed(helena.address, 1n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
      await expect(token.markRedeemed(helena.address, 0n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "ZeroUnits");
    });

    it("rejeita resgates antes do início da validade", async function () {
      const [admin, helena] = await ethers.getSigners();
      const now = BigInt(await time.latest());
      const validFrom = now + 30n * 24n * 3600n;
      const token = await ethers.deployContract("IBIToken", [admin.address, CAP, validFrom, validFrom + FOUR_YEARS, ethers.ZeroAddress]);
      await token.primaryPurchase(helena.address, 2n, ethers.ZeroHash); // pré-venda antes da validade é permitida
      await expect(token.markRedeemed(helena.address, 1n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "TokenNotYetValid").withArgs(validFrom);
      await time.increaseTo(validFrom);
      await token.markRedeemed(helena.address, 1n, ethers.ZeroHash);
      expect(await token.activeUnitsOf(helena.address)).to.equal(1n);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Transferência de unidades já resgatadas", function () {
    it("move primeiro unidades ativas e depois resgatadas, que chegam marcadas", async function () {
      const { token, gabriel, beatriz } = await loadFixture(marketFixture);
      await token.markRedeemed(gabriel.address, 2n, ethers.ZeroHash); // gabriel: 5 (3 ativas, 2 resgatadas)
      await expect(token.connect(gabriel).transfer(beatriz.address, 4n))
        .to.emit(token, "UnitsMoved").withArgs(gabriel.address, beatriz.address, 3n, 1n);
      expect(await token.balanceOf(gabriel.address)).to.equal(1n);
      expect(await token.activeUnitsOf(gabriel.address)).to.equal(0n);
      expect(await token.redeemedUnitsOf(gabriel.address)).to.equal(1n);
      expect(await token.balanceOf(beatriz.address)).to.equal(14n);
      expect(await token.activeUnitsOf(beatriz.address)).to.equal(13n);
      expect(await token.redeemedUnitsOf(beatriz.address)).to.equal(1n);
    });

    it("quando a quantidade cabe nas ativas, nenhuma unidade resgatada se move", async function () {
      const { token, gabriel, beatriz } = await loadFixture(marketFixture);
      await token.markRedeemed(gabriel.address, 2n, ethers.ZeroHash);
      await expect(token.connect(gabriel).transfer(beatriz.address, 3n))
        .to.emit(token, "UnitsMoved").withArgs(gabriel.address, beatriz.address, 3n, 0n);
      expect(await token.redeemedUnitsOf(gabriel.address)).to.equal(2n);
      expect(await token.redeemedUnitsOf(beatriz.address)).to.equal(0n);
    });

    it("uma unidade resgatada não pode ser resgatada de novo pelo novo portador (sem gasto duplo)", async function () {
      const { token, gabriel, beatriz } = await loadFixture(marketFixture);
      await token.markRedeemed(gabriel.address, 5n, ethers.ZeroHash); // todas consumidas
      await token.connect(gabriel).transfer(beatriz.address, 5n);
      expect(await token.activeUnitsOf(beatriz.address)).to.equal(10n); // só as 10 originais seguem ativas
      await expect(token.markRedeemed(beatriz.address, 11n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "InsufficientActiveUnits").withArgs(beatriz.address, 10n, 11n);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Royalties — reporte de receita e registro pro-rata", function () {
    it("calcula 15% do faturamento bruto e registra o devido a cada carteira na fotografia de saldos", async function () {
      const { token, stable, admin, helena, beatriz, gabriel } = await loadFixture(marketFixture);
      const reportHash = ref("relatorio-2027-S1.pdf");
      const royalty = royaltyOf(GROSS_2027);
      const tx = token.reportRevenue(GROSS_2027, reportHash);
      await expect(tx)
        .to.emit(token, "RevenueReported").withArgs(1n, GROSS_2027, royalty, reportHash, CAP, 4n, true)
        .and.to.emit(token, "RoyaltyRegistered").withArgs(1n, helena.address, dueOf(GROSS_2027, 20n))
        .and.to.emit(token, "RoyaltyRegistered").withArgs(1n, admin.address, dueOf(GROSS_2027, 115n));
      expect(await token.lastReportedPeriod()).to.equal(1n);
      expect(await token.royaltyDue(1n, helena.address)).to.equal(dueOf(GROSS_2027, 20n));
      expect(await token.royaltyDue(1n, beatriz.address)).to.equal(dueOf(GROSS_2027, 10n));
      expect(await token.royaltyDue(1n, gabriel.address)).to.equal(dueOf(GROSS_2027, 5n));
      expect(await token.royaltyDue(1n, admin.address)).to.equal(dueOf(GROSS_2027, 115n)); // reserva + unidades não vendidas
      const period = await token.periodInfo(1n);
      expect(period.grossRevenue).to.equal(GROSS_2027);
      expect(period.royaltyAmount).to.equal(royalty);
      expect(period.totalDue).to.equal(dueOf(GROSS_2027, 20n) + dueOf(GROSS_2027, 10n) + dueOf(GROSS_2027, 5n) + dueOf(GROSS_2027, 115n));
      expect(period.snapshotSupply).to.equal(CAP);
      expect(period.holderCount).to.equal(4n);
      expect(period.reportHash).to.equal(reportHash);
      expect(period.onChain).to.equal(true);
      // o total devido foi depositado em stablecoin no contrato, na mesma transação
      expect(await stable.balanceOf(await token.getAddress())).to.equal(period.totalDue);
    });

    it("a fotografia é a do momento do reporte: transferências posteriores não alteram o registro", async function () {
      const { token, helena, beatriz } = await loadFixture(marketFixture);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      await token.connect(helena).transfer(beatriz.address, 10n);
      expect(await token.royaltyDue(1n, helena.address)).to.equal(dueOf(GROSS_2027, 20n));
      expect(await token.royaltyDue(1n, beatriz.address)).to.equal(dueOf(GROSS_2027, 10n));
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash); // período 2 já reflete os novos saldos
      expect(await token.royaltyDue(2n, helena.address)).to.equal(dueOf(GROSS_2027, 10n));
      expect(await token.royaltyDue(2n, beatriz.address)).to.equal(dueOf(GROSS_2027, 20n));
    });

    it("unidades resgatadas continuam contando para o royalty (o token não é consumido)", async function () {
      const { token, helena } = await loadFixture(marketFixture);
      await token.markRedeemed(helena.address, 20n, ethers.ZeroHash);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      expect(await token.royaltyDue(1n, helena.address)).to.equal(dueOf(GROSS_2027, 20n));
    });

    it("exige que a IBITI tenha aprovado a stablecoin: sem allowance o reporte inteiro reverte", async function () {
      const { token, stable, admin } = await loadFixture(marketFixture);
      await stable.connect(admin).approve(await token.getAddress(), 0n);
      await expect(token.reportRevenue(GROSS_2027, ethers.ZeroHash))
        .to.be.revertedWithCustomError(stable, "ERC20InsufficientAllowance");
      expect(await token.lastReportedPeriod()).to.equal(0n);
    });

    it("aceita no máximo 8 semestres, em ordem", async function () {
      const { token } = await loadFixture(marketFixture);
      for (let i = 0; i < 8; i++) await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      expect(await token.lastReportedPeriod()).to.equal(8n);
      await expect(token.reportRevenue(GROSS_2027, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "AllPeriodsReported").withArgs(8n);
    });

    it("um semestre sem faturamento registra royalty zero e avança o período", async function () {
      const { token, helena } = await loadFixture(marketFixture);
      await expect(token.reportRevenue(0n, ethers.ZeroHash))
        .to.emit(token, "RevenueReported").withArgs(1n, 0n, 0n, ethers.ZeroHash, CAP, 4n, true);
      expect(await token.royaltyDue(1n, helena.address)).to.equal(0n);
      expect(await token.lastReportedPeriod()).to.equal(1n);
    });

    it("só a carteira administrativa reporta; períodos não reportados não são consultáveis", async function () {
      const { token, helena } = await loadFixture(marketFixture);
      await expect(token.connect(helena).reportRevenue(GROSS_2027, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
      await expect(token.periodInfo(1n)).to.be.revertedWithCustomError(token, "PeriodNotReported").withArgs(1n);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Royalties — saque em stablecoin (pull)", function () {
    it("cada portador saca o que lhe cabe; segundo saque reverte", async function () {
      const { token, stable, helena } = await loadFixture(marketFixture);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      const due = dueOf(GROSS_2027, 20n);
      await expect(token.connect(helena).claimRoyalty(1n))
        .to.emit(token, "RoyaltyClaimed").withArgs(1n, helena.address, due);
      expect(await stable.balanceOf(helena.address)).to.equal(due);
      expect(await token.royaltyDue(1n, helena.address)).to.equal(0n);
      expect(await token.royaltyPaid(1n, helena.address)).to.equal(due);
      await expect(token.connect(helena).claimRoyalty(1n))
        .to.be.revertedWithCustomError(token, "NothingToClaim").withArgs(1n, helena.address);
    });

    it("a reserva da IBITI também saca a sua parte", async function () {
      const { token, stable, admin } = await loadFixture(marketFixture);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      const before = await stable.balanceOf(admin.address);
      await token.connect(admin).claimRoyalty(1n);
      expect((await stable.balanceOf(admin.address)) - before).to.equal(dueOf(GROSS_2027, 115n));
    });

    it("quem não tinha saldo na fotografia não tem o que sacar; período inexistente reverte", async function () {
      const { token, outsider, helena } = await loadFixture(marketFixture);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      await expect(token.connect(outsider).claimRoyalty(1n))
        .to.be.revertedWithCustomError(token, "NothingToClaim").withArgs(1n, outsider.address);
      await expect(token.connect(helena).claimRoyalty(2n))
        .to.be.revertedWithCustomError(token, "PeriodNotReported").withArgs(2n);
    });

    it("pendingRoyaltyOf soma os períodos ainda não sacados", async function () {
      const { token, helena } = await loadFixture(marketFixture);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      await token.reportRevenue(GROSS_2027 * 2n, ethers.ZeroHash);
      expect(await token.pendingRoyaltyOf(helena.address)).to.equal(dueOf(GROSS_2027, 20n) + dueOf(GROSS_2027 * 2n, 20n));
      await token.connect(helena).claimRoyalty(1n);
      expect(await token.pendingRoyaltyOf(helena.address)).to.equal(dueOf(GROSS_2027 * 2n, 20n));
    });

    it("liquidação fora da chain não se aplica a período pago on-chain", async function () {
      const { token, helena } = await loadFixture(marketFixture);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      await expect(token.settleOffChain(1n, helena.address, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "PeriodOnChain").withArgs(1n);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Royalties — liquidação em reais fora da blockchain", function () {
    it("sem stablecoin, o reporte apenas registra o devido e a IBITI marca os pagamentos", async function () {
      const { token, admin, helena, beatriz } = await loadFixture(deployOffChainFixture);
      await token.primaryPurchase(helena.address, 20n, ethers.ZeroHash);
      await token.primaryPurchase(beatriz.address, 10n, ethers.ZeroHash);
      await expect(token.reportRevenue(GROSS_2027, ethers.ZeroHash))
        .to.emit(token, "RevenueReported").withArgs(1n, GROSS_2027, royaltyOf(GROSS_2027), ethers.ZeroHash, CAP, 3n, false);
      expect((await token.periodInfo(1n)).onChain).to.equal(false);
      await expect(token.connect(helena).claimRoyalty(1n))
        .to.be.revertedWithCustomError(token, "PeriodNotOnChain").withArgs(1n);

      const due = dueOf(GROSS_2027, 20n);
      const paymentRef = ref("TED-2027-07-15-helena");
      await expect(token.settleOffChain(1n, helena.address, paymentRef))
        .to.emit(token, "RoyaltySettledOffChain").withArgs(1n, helena.address, due, paymentRef);
      expect(await token.royaltyDue(1n, helena.address)).to.equal(0n);
      expect(await token.royaltyPaid(1n, helena.address)).to.equal(due);
      await expect(token.settleOffChain(1n, helena.address, paymentRef))
        .to.be.revertedWithCustomError(token, "NothingToClaim").withArgs(1n, helena.address);
      await expect(token.connect(helena).settleOffChain(1n, beatriz.address, paymentRef))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
      expect(await token.royaltyDue(1n, admin.address)).to.equal(dueOf(GROSS_2027, 120n));
    });

    it("a stablecoin pode ser definida uma única vez; períodos anteriores seguem fora da chain", async function () {
      const { token, stable, admin, helena } = await loadFixture(deployOffChainFixture);
      await token.primaryPurchase(helena.address, 20n, ethers.ZeroHash);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash); // período 1: off-chain
      await expect(token.setStablecoin(ethers.ZeroAddress)).to.be.revertedWithCustomError(token, "InvalidAddress");
      await expect(token.setStablecoin(await stable.getAddress()))
        .to.emit(token, "StablecoinSet").withArgs(await stable.getAddress());
      await expect(token.setStablecoin(await stable.getAddress()))
        .to.be.revertedWithCustomError(token, "StablecoinAlreadySet").withArgs(await stable.getAddress());
      await stable.mint(admin.address, brl("10000000"));
      await stable.connect(admin).approve(await token.getAddress(), ethers.MaxUint256);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash); // período 2: on-chain
      expect((await token.periodInfo(1n)).onChain).to.equal(false);
      expect((await token.periodInfo(2n)).onChain).to.equal(true);
      await expect(token.connect(helena).claimRoyalty(1n)).to.be.revertedWithCustomError(token, "PeriodNotOnChain");
      await token.connect(helena).claimRoyalty(2n);
      expect(await stable.balanceOf(helena.address)).to.equal(dueOf(GROSS_2027, 20n));
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Reemissão por perda de chave ou sucessão", function () {
    it("move saldo, contadores e royalties pendentes para a nova carteira e invalida a antiga", async function () {
      const { token, stable, helena, heir } = await loadFixture(marketFixture);
      await token.markRedeemed(helena.address, 2n, ethers.ZeroHash);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      const due = dueOf(GROSS_2027, 20n);

      await expect(token.reissue(helena.address, heir.address))
        .to.emit(token, "Reissued").withArgs(helena.address, heir.address, 20n, 2n)
        .and.to.emit(token, "Transfer").withArgs(helena.address, ethers.ZeroAddress, 20n)
        .and.to.emit(token, "Transfer").withArgs(ethers.ZeroAddress, heir.address, 20n);

      expect(await token.totalSupply()).to.equal(CAP);
      expect(await token.balanceOf(helena.address)).to.equal(0n);
      expect(await token.revoked(helena.address)).to.equal(true);
      expect(await token.isMember(helena.address)).to.equal(false);
      expect(await token.balanceOf(heir.address)).to.equal(20n);
      expect(await token.activeUnitsOf(heir.address)).to.equal(18n);
      expect(await token.redeemedUnitsOf(heir.address)).to.equal(2n);
      expect(await token.isMember(heir.address)).to.equal(true);
      expect(await token.royaltyDue(1n, helena.address)).to.equal(0n);
      expect(await token.royaltyDue(1n, heir.address)).to.equal(due);
      expect(await token.holders()).to.not.include(helena.address);
      expect(await token.holders()).to.include(heir.address);

      await token.connect(heir).claimRoyalty(1n);
      expect(await stable.balanceOf(heir.address)).to.equal(due);
    });

    it("a carteira revogada não recebe, não transfere, não resgata nem saca", async function () {
      const { token, helena, beatriz, heir } = await loadFixture(marketFixture);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      await token.reissue(helena.address, heir.address);
      await expect(token.connect(beatriz).transfer(helena.address, 1n))
        .to.be.revertedWithCustomError(token, "WalletRevoked").withArgs(helena.address);
      await expect(token.primaryPurchase(helena.address, 1n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "WalletRevoked").withArgs(helena.address);
      await expect(token.markRedeemed(helena.address, 1n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "WalletRevoked").withArgs(helena.address);
      await expect(token.connect(helena).claimRoyalty(1n))
        .to.be.revertedWithCustomError(token, "WalletRevoked").withArgs(helena.address);
      await expect(token.reissue(beatriz.address, helena.address))
        .to.be.revertedWithCustomError(token, "WalletRevoked").withArgs(helena.address);
    });

    it("valida os parâmetros da reemissão (saldo, endereços, teto, carteira administrativa)", async function () {
      const { token, admin, helena, beatriz, outsider, heir } = await loadFixture(marketFixture);
      await expect(token.reissue(outsider.address, heir.address))
        .to.be.revertedWithCustomError(token, "NothingToReissue").withArgs(outsider.address);
      await expect(token.reissue(helena.address, helena.address)).to.be.revertedWithCustomError(token, "InvalidAddress");
      await expect(token.reissue(helena.address, ethers.ZeroAddress)).to.be.revertedWithCustomError(token, "InvalidAddress");
      await expect(token.reissue(admin.address, heir.address)).to.be.revertedWithCustomError(token, "InvalidAddress");
      await expect(token.reissue(helena.address, beatriz.address))
        .to.be.revertedWithCustomError(token, "WalletCapExceeded").withArgs(beatriz.address, 30n, MAX_PER_WALLET);
      await expect(token.connect(helena).reissue(helena.address, heir.address))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("depois da reemissão, o próximo reporte contempla a nova carteira e não a antiga", async function () {
      const { token, helena, heir } = await loadFixture(marketFixture);
      await token.reissue(helena.address, heir.address);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      expect(await token.royaltyDue(1n, helena.address)).to.equal(0n);
      expect(await token.royaltyDue(1n, heir.address)).to.equal(dueOf(GROSS_2027, 20n));
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Validade de 4 anos", function () {
    it("após a expiração, transferências e resgates são rejeitados; membership se extingue", async function () {
      const { token, helena, beatriz, validUntil } = await loadFixture(marketFixture);
      await time.increaseTo(validUntil + 1n);
      expect(await token.isExpired()).to.equal(true);
      expect(await token.isMember(helena.address)).to.equal(false);
      expect((await token.accessInfo(helena.address)).expired).to.equal(true);
      await expect(token.connect(helena).transfer(beatriz.address, 1n))
        .to.be.revertedWithCustomError(token, "TokenExpired").withArgs(validUntil);
      await expect(token.primaryPurchase(beatriz.address, 1n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "TokenExpired").withArgs(validUntil);
      await expect(token.markRedeemed(helena.address, 1n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "TokenExpired").withArgs(validUntil);
      expect(await token.balanceOf(helena.address)).to.equal(20n); // o registro permanece como histórico
    });

    it("o fechamento do último semestre e os saques continuam possíveis depois da expiração", async function () {
      const { token, stable, helena, validUntil } = await loadFixture(marketFixture);
      for (let i = 0; i < 7; i++) await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      await time.increaseTo(validUntil + 1n);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash); // 8º semestre, apurado após o fim do prazo
      expect(await token.lastReportedPeriod()).to.equal(8n);
      await token.connect(helena).claimRoyalty(8n);
      expect(await stable.balanceOf(helena.address)).to.equal(dueOf(GROSS_2027, 20n));
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Pausa de emergência", function () {
    it("congela transferências, compras, resgates, reportes e saques; unpause restaura", async function () {
      const { token, helena, beatriz, outsider } = await loadFixture(marketFixture);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);
      await expect(token.connect(helena).pause()).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
      await token.pause();
      await expect(token.connect(helena).transfer(beatriz.address, 1n)).to.be.revertedWithCustomError(token, "EnforcedPause");
      await expect(token.primaryPurchase(outsider.address, 1n, ethers.ZeroHash)).to.be.revertedWithCustomError(token, "EnforcedPause");
      await expect(token.markRedeemed(helena.address, 1n, ethers.ZeroHash)).to.be.revertedWithCustomError(token, "EnforcedPause");
      await expect(token.reportRevenue(GROSS_2027, ethers.ZeroHash)).to.be.revertedWithCustomError(token, "EnforcedPause");
      await expect(token.connect(helena).claimRoyalty(1n)).to.be.revertedWithCustomError(token, "EnforcedPause");
      await token.unpause();
      await token.connect(helena).transfer(beatriz.address, 1n);
      await token.connect(helena).claimRoyalty(1n);
      expect(await token.balanceOf(beatriz.address)).to.equal(11n);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Administração única da IBITI", function () {
    it("troca de carteira administrativa em dois passos, com entrega da reserva à nova carteira", async function () {
      const { token, admin, helena, newAdmin } = await loadFixture(marketFixture);
      await token.transferOwnership(newAdmin.address);
      expect(await token.owner()).to.equal(admin.address);
      expect(await token.pendingOwner()).to.equal(newAdmin.address);
      await expect(token.connect(helena).acceptOwnership()).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
      await token.connect(newAdmin).acceptOwnership();
      expect(await token.owner()).to.equal(newAdmin.address);
      // a antiga carteira entrega o saldo (reserva + unidades à venda) à nova carteira administrativa
      await token.connect(admin).transfer(newAdmin.address, 115n);
      expect(await token.balanceOf(newAdmin.address)).to.equal(115n);
      expect(await token.saleableUnits()).to.equal(65n);
      await expect(token.connect(admin).primaryPurchase(helena.address, 1n, ethers.ZeroHash))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
      const [, , , , , outsider] = await ethers.getSigners();
      await token.connect(newAdmin).primaryPurchase(outsider.address, 1n, ethers.ZeroHash);
      expect(await token.balanceOf(outsider.address)).to.equal(1n);
    });

    it("a renúncia à administração está desabilitada", async function () {
      const { token } = await loadFixture(marketFixture);
      await expect(token.renounceOwnership()).to.be.revertedWithCustomError(token, "RenounceDisabled");
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  describe("Invariantes", function () {
    it("soma dos saldos = supply; resgatadas <= saldo; registro de portadores = carteiras com saldo", async function () {
      const { token, admin, helena, beatriz, gabriel, heir } = await loadFixture(marketFixture);
      await token.markRedeemed(helena.address, 7n, ethers.ZeroHash);
      await token.connect(helena).transfer(beatriz.address, 10n);
      await token.connect(beatriz).transfer(gabriel.address, 15n);
      await token.reissue(gabriel.address, heir.address);
      await token.connect(helena).transfer(admin.address, 10n);
      await token.reportRevenue(GROSS_2027, ethers.ZeroHash);

      const wallets = [admin, helena, beatriz, gabriel, heir].map((s) => s.address);
      let sum = 0n;
      const withBalance: string[] = [];
      for (const w of wallets) {
        const bal = await token.balanceOf(w);
        sum += bal;
        expect(await token.redeemedUnitsOf(w)).to.be.lte(bal);
        if (bal > 0n) withBalance.push(w);
      }
      expect(sum).to.equal(CAP);
      const holders = [...(await token.holders())].sort();
      expect(holders).to.deep.equal(withBalance.sort());

      const period = await token.periodInfo(1n);
      let dues = 0n;
      for (const w of wallets) dues += await token.royaltyDue(1n, w);
      expect(dues).to.equal(period.totalDue);
      expect(period.totalDue).to.be.lte(period.royaltyAmount);
    });
  });
});
