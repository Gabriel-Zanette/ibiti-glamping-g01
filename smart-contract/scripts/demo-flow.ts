import { network } from "hardhat";

/**
 * Fluxo completo de demonstração do IBIToken na rede simulada do Hardhat.
 * Executar: `npx hardhat run scripts/demo-flow.ts`
 *
 * Reproduz, passo a passo, o ciclo descrito no whitepaper (seções 3.2, 4.4, 5.3, 6.2, 9):
 * emissão → compras primárias → travas de transferência → resgate sem queima → transferência de
 * unidades resgatadas → reporte de receita e royalty pro-rata → saque em stablecoin → reemissão por
 * perda de chave → verificação de acesso por um parceiro → expiração dos 4 anos.
 */
const { ethers, networkHelpers } = await network.create();

const CAP = 150n;
const FOUR_YEARS = 1461n * 24n * 60n * 60n;
const ref = (s: string) => ethers.keccak256(ethers.toUtf8Bytes(s));
const tbrl = (v: bigint) => `${ethers.formatUnits(v, 6)} tBRL`;

let step = 0;
const title = (t: string) => console.log(`\n${"─".repeat(78)}\n${++step}. ${t}\n${"─".repeat(78)}`);
const expectRevert = async (label: string, p: Promise<unknown>) => {
  try {
    await p;
    console.log(`   ✗ ${label}: NÃO reverteu (inesperado)`);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    const m = msg.match(/reverted with custom error '([^']+)'/) ?? msg.match(/([A-Za-z]+Error|[A-Z][A-Za-z]+)\(/);
    console.log(`   ✓ ${label}: rejeitado pelo contrato (${m ? m[1] : "revert"})`);
  }
};

const [ibiti, helena, beatriz, gabriel, parceiro, herdeira] = await ethers.getSigners();

title("Emissão única: deploy do IBIToken (150 unidades) com stablecoin de teste");
const stable = await ethers.deployContract("MockStablecoin", ["Stablecoin de Teste", "tBRL", 6]);
const validFrom = BigInt(await networkHelpers.time.latest());
const validUntil = validFrom + FOUR_YEARS;
const token = await ethers.deployContract("IBIToken", [ibiti.address, CAP, validFrom, validUntil, await stable.getAddress()]);
await stable.mint(ibiti.address, ethers.parseUnits("100000000", 6));
await stable.connect(ibiti).approve(await token.getAddress(), ethers.MaxUint256);
console.log(`   Contrato: ${await token.getAddress()}`);
console.log(`   Carteira administrativa (IBITI): ${ibiti.address}`);
console.log(`   Supply: ${await token.totalSupply()} · reserva IBITI: ${await token.reservedUnits()} · teto por carteira: ${await token.maxPerWallet()} · à venda: ${await token.saleableUnits()}`);
console.log(`   Validade: ${new Date(Number(validFrom) * 1000).toISOString()} → ${new Date(Number(validUntil) * 1000).toISOString()}`);

title("Compras primárias (após verificação de identidade fora da chain)");
await token.primaryPurchase(helena.address, 20n, ref("venda#001-helena"));
await token.primaryPurchase(beatriz.address, 10n, ref("venda#002-beatriz"));
await token.primaryPurchase(gabriel.address, 5n, ref("venda#003-gabriel"));
console.log(`   Helena (jornada assistida): ${await token.balanceOf(helena.address)} · Beatriz: ${await token.balanceOf(beatriz.address)} · Gabriel (jornada expert): ${await token.balanceOf(gabriel.address)}`);
console.log(`   Unidades ainda à venda: ${await token.saleableUnits()} · portadores: ${(await token.holders()).length}`);
await expectRevert("Vender 21 unidades a uma carteira (teto 20)", token.primaryPurchase(parceiro.address, 21n, ref("x")));

title("Travas de transferência");
await expectRevert("Gabriel → carteira não verificada (sem saldo)", token.connect(gabriel).transfer(parceiro.address, 1n));
await expectRevert("Beatriz → Helena, que já está no teto de 20", token.connect(beatriz).transfer(helena.address, 1n));
await token.connect(beatriz).transfer(gabriel.address, 2n);
console.log(`   ✓ Beatriz → Gabriel (2 unidades, ambos verificados): Beatriz ${await token.balanceOf(beatriz.address)} · Gabriel ${await token.balanceOf(gabriel.address)}`);

title("Resgate da experiência: marcação sem queima");
await token.markRedeemed(helena.address, 2n, ref("voucher#2027-0001"));
const h = await token.accessInfo(helena.address);
console.log(`   Helena usou 2 experiências → saldo ${h.balance} · ativas ${h.active} · resgatadas ${h.redeemed} · membro: ${h.member}`);
console.log(`   Supply inalterado: ${await token.totalSupply()} (nenhuma queima)`);
await expectRevert("Resgatar 19 unidades tendo 18 ativas", token.markRedeemed(helena.address, 19n, ref("v")));

title("Transferência de unidades já resgatadas (chegam marcadas, sem gasto duplo)");
await token.markRedeemed(gabriel.address, 7n, ref("voucher#2027-0002")); // Gabriel: 7 unidades, todas usadas
await token.connect(gabriel).transfer(beatriz.address, 3n);
const g = await token.accessInfo(gabriel.address);
const b = await token.accessInfo(beatriz.address);
console.log(`   Gabriel: saldo ${g.balance} · ativas ${g.active} · resgatadas ${g.redeemed}`);
console.log(`   Beatriz: saldo ${b.balance} · ativas ${b.active} · resgatadas ${b.redeemed} (recebeu 3 unidades já consumidas)`);

title("Reporte do 1º semestre: faturamento bruto → royalty 15% → registro pro-rata + depósito em stablecoin");
const gross = ethers.parseUnits("3398738.38", 6); // metade do faturamento bruto projetado para 2027 (whitepaper, 4.2)
await token.reportRevenue(gross, ref("relatorio-financeiro-2027-S1.pdf"));
const p1 = await token.periodInfo(1);
console.log(`   Faturamento bruto reportado: ${tbrl(p1.grossRevenue)} · royalty (15%): ${tbrl(p1.royaltyAmount)} · carteiras: ${p1.holderCount} · depositado no contrato: ${tbrl(await stable.balanceOf(await token.getAddress()))}`);
for (const [nome, s] of [["IBITI (reserva + não vendidas)", ibiti], ["Helena", helena], ["Beatriz", beatriz], ["Gabriel", gabriel]] as const) {
  console.log(`   ${nome.padEnd(32)} saldo ${String(await token.balanceOf(s.address)).padStart(3)} → devido ${tbrl(await token.royaltyDue(1, s.address))}`);
}

title("Saque do royalty (pull): cada portador saca a sua parte");
await token.connect(gabriel).claimRoyalty(1);
console.log(`   Gabriel sacou: ${tbrl(await stable.balanceOf(gabriel.address))}`);
await expectRevert("Gabriel sacar de novo o mesmo período", token.connect(gabriel).claimRoyalty(1));
await expectRevert("Parceiro (sem token) sacar", token.connect(parceiro).claimRoyalty(1));

title("Reemissão por perda de chave: Helena → herdeira (processo administrativo fora da chain)");
await token.reissue(helena.address, herdeira.address);
const hh = await token.accessInfo(herdeira.address);
console.log(`   Herdeira: saldo ${hh.balance} · ativas ${hh.active} · resgatadas ${hh.redeemed} · royalty pendente: ${tbrl(await token.pendingRoyaltyOf(herdeira.address))}`);
console.log(`   Helena (antiga): saldo ${await token.balanceOf(helena.address)} · revogada: ${await token.revoked(helena.address)} · membro: ${await token.isMember(helena.address)}`);
await expectRevert("Beatriz → carteira revogada de Helena", token.connect(beatriz).transfer(helena.address, 1n));

title("Verificação de acesso por um parceiro do território (leitura pública, sem dado pessoal)");
for (const [nome, addr] of [["Herdeira", herdeira.address], ["Beatriz", beatriz.address], ["Parceiro", parceiro.address]] as const) {
  const i = await token.accessInfo(addr);
  console.log(`   ${nome.padEnd(10)} membro: ${String(i.member).padEnd(5)} saldo ${i.balance} · ativas ${i.active} · resgatadas ${i.redeemed}`);
}

title("Expiração dos 4 anos (viagem no tempo na rede simulada)");
await networkHelpers.time.increaseTo(validUntil + 1n);
console.log(`   isExpired: ${await token.isExpired()} · herdeira ainda é membro? ${await token.isMember(herdeira.address)}`);
await expectRevert("Transferir após a expiração", token.connect(beatriz).transfer(gabriel.address, 1n));
await expectRevert("Resgatar após a expiração", token.markRedeemed(herdeira.address, 1n, ref("v")));
console.log(`   Saldos permanecem como histórico: herdeira ${await token.balanceOf(herdeira.address)} · supply ${await token.totalSupply()}`);

console.log(`\nFluxo concluído.`);
