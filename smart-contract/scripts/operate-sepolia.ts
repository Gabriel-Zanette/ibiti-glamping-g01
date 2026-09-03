import { network } from "hardhat";

/**
 * Operação de um IBIToken já implantado (Sepolia ou rede local) pela carteira administrativa.
 * Uso:
 *   TOKEN=0x... ACTION=status                                   npx hardhat run scripts/operate-sepolia.ts --network sepolia
 *   TOKEN=0x... ACTION=purchase TO=0x... UNITS=5 REF="venda#1"  npx hardhat run scripts/operate-sepolia.ts --network sepolia
 *   TOKEN=0x... ACTION=redeem   HOLDER=0x... UNITS=1 REF="voucher#1"
 *   TOKEN=0x... ACTION=report   GROSS=3398738.38 REF="relatorio-2027-S1.pdf"   (valor em unidades da stablecoin; ex.: tBRL)
 *   TOKEN=0x... ACTION=reissue  FROM=0x... TO=0x...
 *   TOKEN=0x... ACTION=access   HOLDER=0x...                    (consulta pública: qualquer carteira pode rodar)
 *
 * A carteira usada é a configurada em SEPOLIA_PRIVATE_KEY (keystore ou variável de ambiente).
 */
const { ethers } = await network.create();

const env = (name: string, fallback?: string): string => {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Variável de ambiente obrigatória: ${name}`);
  return v;
};
const ref = (s: string) => (s.startsWith("0x") && s.length === 66 ? s : ethers.keccak256(ethers.toUtf8Bytes(s)));

const [signer] = await ethers.getSigners();
const token = await ethers.getContractAt("IBIToken", env("TOKEN"), signer);
const action = env("ACTION", "status");

console.log(`Rede: ${(await ethers.provider.getNetwork()).name} · contrato: ${await token.getAddress()} · signatário: ${signer.address}`);

async function printStatus() {
  const stablecoinAddress: string = await token.stablecoin();
  console.log(`Token: ${await token.name()} (${await token.symbol()}) · supply ${await token.totalSupply()} · reserva ${await token.reservedUnits()} · teto/carteira ${await token.maxPerWallet()}`);
  console.log(`Administrador: ${await token.owner()} · à venda: ${await token.saleableUnits()} · portadores: ${await token.holderCount()} · pausado: ${await token.paused()}`);
  console.log(`Validade: ${new Date(Number(await token.validFrom()) * 1000).toISOString()} → ${new Date(Number(await token.validUntil()) * 1000).toISOString()} · expirado: ${await token.isExpired()}`);
  console.log(`Stablecoin: ${stablecoinAddress} · períodos reportados: ${await token.lastReportedPeriod()}/${await token.TOTAL_PERIODS()}`);
  for (const holder of await token.holders()) {
    const i = await token.accessInfo(holder);
    console.log(`  ${holder}  saldo ${String(i.balance).padStart(3)} · ativas ${String(i.active).padStart(3)} · resgatadas ${String(i.redeemed).padStart(3)} · membro ${i.member} · royalty pendente ${await token.pendingRoyaltyOf(holder)}`);
  }
}

switch (action) {
  case "status":
    await printStatus();
    break;

  case "purchase": {
    const tx = await token.primaryPurchase(env("TO"), BigInt(env("UNITS")), ref(env("REF", "")));
    console.log(`Compra primária enviada: ${tx.hash}`);
    await tx.wait();
    console.log(`Confirmada. Saldo de ${env("TO")}: ${await token.balanceOf(env("TO"))}`);
    break;
  }

  case "redeem": {
    const tx = await token.markRedeemed(env("HOLDER"), BigInt(env("UNITS")), ref(env("REF", "")));
    console.log(`Resgate marcado: ${tx.hash}`);
    await tx.wait();
    const i = await token.accessInfo(env("HOLDER"));
    console.log(`Confirmado. ${env("HOLDER")}: saldo ${i.balance} · ativas ${i.active} · resgatadas ${i.redeemed}`);
    break;
  }

  case "report": {
    const stablecoinAddress: string = await token.stablecoin();
    let decimals = 2; // sem stablecoin: unidade de conta = centavos de real
    if (stablecoinAddress !== ethers.ZeroAddress) {
      const stable = await ethers.getContractAt("MockStablecoin", stablecoinAddress, signer);
      decimals = Number(await stable.decimals());
      const gross = ethers.parseUnits(env("GROSS"), decimals);
      const royalty = (gross * (await token.ROYALTY_BPS())) / (await token.BPS_DENOMINATOR());
      const allowance = await stable.allowance(signer.address, await token.getAddress());
      if (allowance < royalty) {
        console.log(`Aprovando ${ethers.formatUnits(royalty, decimals)} da stablecoin para o depósito do royalty...`);
        await (await stable.approve(await token.getAddress(), royalty)).wait();
      }
    }
    const gross = ethers.parseUnits(env("GROSS"), decimals);
    const tx = await token.reportRevenue(gross, ref(env("REF", "")));
    console.log(`Reporte enviado: ${tx.hash}`);
    await tx.wait();
    const period = await token.lastReportedPeriod();
    const info = await token.periodInfo(period);
    console.log(`Período ${period} registrado: faturamento ${ethers.formatUnits(info.grossRevenue, decimals)} · royalty ${ethers.formatUnits(info.royaltyAmount, decimals)} · carteiras ${info.holderCount} · on-chain ${info.onChain}`);
    break;
  }

  case "reissue": {
    const tx = await token.reissue(env("FROM"), env("TO"));
    console.log(`Reemissão enviada: ${tx.hash}`);
    await tx.wait();
    console.log(`Confirmada. Nova carteira ${env("TO")}: saldo ${await token.balanceOf(env("TO"))} · antiga revogada: ${await token.revoked(env("FROM"))}`);
    break;
  }

  case "access": {
    const i = await token.accessInfo(env("HOLDER"));
    console.log(`${env("HOLDER")}: membro ${i.member} · saldo ${i.balance} · ativas ${i.active} · resgatadas ${i.redeemed} · expirado ${i.expired}`);
    break;
  }

  default:
    throw new Error(`ACTION desconhecida: ${action}`);
}
