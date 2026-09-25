import { test } from 'node:test';
import assert from 'node:assert/strict';
import { id, ZeroAddress, ZeroHash } from 'ethers';
import { localChain } from '../tools/local-chain.ts';
const FROM = 1798761600; // 01/01/2027 UTC
const UNTIL = 1924991999; // 31/12/2030 23:59:59 UTC
const ENDS = ['2027-07-01','2028-01-01','2028-07-01','2029-01-01','2029-07-01','2030-01-01','2030-07-01','2031-01-01'].map(d=>Date.parse(d+'T00:00:00Z')/1000);
const PERSON_A=id('identificador-aleatorio-A'), PERSON_B=id('identificador-aleatorio-B');
async function setup(t: any, legacy = false) {
  const c = await localChain(); t.after(() => c.stop());
  await c.provider.send('anvil_setBlockTimestampInterval',[0]);
  const [admin, a, b, next, alt, outsider] = c.signers;
  const token = await c.deploy(legacy ? 'LegacyPositionFixture' : 'IBIToken', [admin.address, 150, FROM, UNTIL, ZeroAddress]);
  await (await token.registerWallet(a.address,PERSON_A)).wait();
  await (await token.registerWallet(b.address,PERSON_B)).wait();
  await (await token.registerWallet(alt.address,PERSON_A)).wait();
  const buy=async(w:any,n:number)=>{await(await token.primaryPurchase(w.address,n,id('compra'))).wait();};
  const warp=async(n:number)=>{await c.provider.send('evm_setNextBlockTimestamp',[n]);await c.provider.send('evm_mine',[]);};
  const stableMode=async()=>{
    const stable=await c.deploy('MockStablecoin',['Teste','tBRL',6]);
    await(await token.setStablecoin(await stable.getAddress())).wait();
    await(await token.setPrimaryPrice(37_055_190000n)).wait();
    return stable;
  };
  const recover=async(old:any,dest:any)=>{
    await(await token.requestRecovery(old.address,dest.address,id('processo'))).wait();
    const r=await token.recoveries(old.address);await warp(Number(r.executeAfter));
    await(await token.reissue(old.address,dest.address)).wait();
  };
  await warp(FROM);
  return { ...c, token, admin, a, b, next, alt, outsider, buy, warp, stableMode, recover };
}
async function rejects(token:any,call:Promise<unknown>,name:string) {
  await assert.rejects(call,(e:any)=>{
    const data=e.data ?? e.info?.error?.data;
    assert.equal(token.interface.parseError(data)?.name,name);return true;
  });
}
test('feedback: rejeita apuração antes do encerramento do semestre sem consumir período', async t => {
  const {token,warp}=await setup(t);
  await warp(ENDS[0]-1);
  await rejects(token,token.reportRevenue.staticCall(1_000_000,id('antecipado')),'PeriodNotClosed');
  assert.equal(await token.lastReportedPeriod(),0n);
  await warp(ENDS[0]);await(await token.reportRevenue(1_000_000,id('fechado'))).wait();
  assert.equal(await token.lastReportedPeriod(),1n);
});
test('feedback: recuperação não pode confiscar posição para administrador ou tesouraria', async t => {
  const {token,admin,a,next,buy}=await setup(t);await buy(a,20);
  await rejects(token,token.requestRecovery(a.address,admin.address,id('processo')),'InvalidAddress');
  await rejects(token,token.reissue(a.address,admin.address),'InvalidAddress');
  await(await token.transferOwnership(next.address)).wait();
  await rejects(token,token.requestRecovery(a.address,next.address,id('processo')),'InvalidAddress');
  await(await token.connect(next).acceptOwnership()).wait();
  await rejects(token,token.connect(next).requestRecovery(a.address,admin.address,id('processo')),'InvalidAddress');
  await rejects(token,token.connect(next).requestRecovery(a.address,next.address,id('processo')),'InvalidAddress');
  assert.equal(await token.balanceOf(a.address),20n);
});
test('feedback: troca de administrador preserva estoque, compra e reserva', async t => {
  const {token,admin,a,next}=await setup(t);
  await(await token.transferOwnership(next.address)).wait();await(await token.connect(next).acceptOwnership()).wait();
  await(await token.connect(next).primaryPurchase(a.address,1,id('compra'))).wait();
  assert.equal(await token.treasury(),admin.address);assert.equal(await token.balanceOf(admin.address),149n);
  assert.equal(await token.balanceOf(a.address),1n);assert.equal(await token.saleableUnits(),99n);
  await rejects(token,token.primaryPurchase(a.address,1,id('antigo-admin')),'OwnableUnauthorizedAccount');
  for(let i=0;i<5;i++) {
    const w=await (await import('ethers')).Wallet.createRandom().getAddress();
    await(await token.connect(next).registerWallet(w,id('pessoa'+i))).wait();
    await(await token.connect(next).primaryPurchase(w,i===0?19:20,id('estoque'))).wait();
  }
  await rejects(token,token.connect(next).primaryPurchase(a.address,1,id('reserva')),'ReserveProtected');
  assert.equal(await token.balanceOf(admin.address),50n);
});
test('feedback: compras em duas carteiras da mesma pessoa não excedem 20', async t => {
  const {token,a,alt,buy}=await setup(t);await buy(a,20);
  await rejects(token,token.primaryPurchase(alt.address,1,id('compra')),'PersonCapExceeded');
  assert.equal(await token.personBalance(PERSON_A),20n);
});
test('feedback: transfer e transferFrom ficam bloqueados mesmo com allowance', async t => {
  const {token,a,b,alt,outsider,buy}=await setup(t);await buy(a,10);await buy(alt,10);await buy(b,2);
  await rejects(token,token.connect(b).transfer(a.address,1),'SecondaryTransfersDisabled');
  await(await token.connect(b).approve(outsider.address,1)).wait();
  await rejects(token,token.connect(outsider).transferFrom(b.address,alt.address,1),'SecondaryTransfersDisabled');
  assert.equal(await token.allowance(b.address,outsider.address),1n);
});
test('transferência interna à mesma pessoa no teto não duplica agregado', async t => {
  const {token,a,alt,buy}=await setup(t);await buy(a,15);await buy(alt,5);
  await rejects(token,token.connect(a).transfer(alt.address,5),'SecondaryTransfersDisabled');
  assert.equal(await token.personBalance(PERSON_A),20n);assert.equal(await token.balanceOf(alt.address),5n);
  await rejects(token,token.connect(a).transfer(a.address,10),'SecondaryTransfersDisabled');assert.equal(await token.personBalance(PERSON_A),20n);
});
test('cadastro obrigatório, exclusivo e restrito à administração', async t => {
  const {token,a,next,admin}=await setup(t);
  await rejects(token,token.primaryPurchase(next.address,1,id('sem-cadastro')),'WalletNotRegistered');
  await rejects(token,token.registerWallet(a.address,PERSON_B),'WalletAlreadyRegistered');
  await rejects(token,token.connect(a).registerWallet(next.address,PERSON_A),'OwnableUnauthorizedAccount');
  await rejects(token,token.registerWallet(next.address,ZeroHash),'InvalidAddress');
  await rejects(token,token.registerWallet(admin.address,PERSON_A),'InvalidAddress');
});
test('porta de entrada e transferFrom da tesouraria não contornam compra', async t => {
  const {token,a,alt,admin,outsider,buy}=await setup(t);await buy(a,1);
  await rejects(token,token.connect(a).transfer(alt.address,1),'SecondaryTransfersDisabled');
  await rejects(token,token.transfer(alt.address,1),'PrimaryPurchaseRequired');
  await(await token.approve(outsider.address,1)).wait();
  await rejects(token,token.connect(outsider).transferFrom(admin.address,alt.address,1),'PrimaryPurchaseRequired');
});
test('devolução informal à tesouraria é bloqueada sem alterar posição', async t => {
  const {token,a,admin,buy}=await setup(t);await buy(a,5);
  await rejects(token,token.connect(a).transfer(admin.address,5),'SecondaryTransfersDisabled');
  assert.equal(await token.personBalance(PERSON_A),5n);assert.equal(await token.totalSupply(),150n);
  assert.deepEqual([...(await token.holders())],[admin.address,a.address]);
});
test('recuperação exige anúncio e prazo, migra saldo sem inflação e revoga origem', async t => {
  const {token,a,next,buy,warp}=await setup(t);await buy(a,20);
  await rejects(token,token.reissue(a.address,next.address),'InvalidRecovery');
  await(await token.requestRecovery(a.address,next.address,id('processo'))).wait();
  const r=await token.recoveries(a.address);await warp(Number(r.executeAfter)-1);
  await rejects(token,token.reissue.staticCall(a.address,next.address),'RecoveryNotReady');
  await warp(Number(r.executeAfter));await(await token.reissue(a.address,next.address)).wait();
  assert.equal(await token.balanceOf(next.address),20n);assert.equal(await token.balanceOf(a.address),0n);
  assert.equal(await token.personOf(next.address),PERSON_A);assert.equal(await token.personBalance(PERSON_A),20n);
  assert.equal(await token.totalSupply(),150n);assert.equal(await token.revoked(a.address),true);
  await rejects(token,token.primaryPurchase(a.address,1,id('revogada')),'WalletRevoked');
});
test('recuperação impede destino de outra pessoa, com saldo, contrato ou já reservado', async t => {
  const {token,a,b,next,alt,buy}=await setup(t);await buy(a,5);await buy(alt,1);
  await rejects(token,token.requestRecovery(a.address,b.address,id('processo')),'InvalidRecovery');
  await rejects(token,token.requestRecovery(a.address,alt.address,id('processo')),'InvalidRecovery');
  await rejects(token,token.requestRecovery(a.address,await token.getAddress(),id('processo')),'InvalidAddress');
  await(await token.requestRecovery(a.address,next.address,id('processo'))).wait();
  await rejects(token,token.requestRecovery(alt.address,next.address,id('processo')),'RecoveryPending');
  await rejects(token,token.registerWallet(next.address,PERSON_B),'RecoveryPending');
});
test('recuperação congela transferências e recebimento, cancelamento devolve operação', async t => {
  const {token,a,b,next,buy}=await setup(t);await buy(a,5);await buy(b,1);
  await(await token.requestRecovery(a.address,next.address,id('processo'))).wait();
  await rejects(token,token.connect(a).transfer(b.address,1),'RecoveryPending');
  await rejects(token,token.connect(b).transfer(a.address,1),'RecoveryPending');
  await rejects(token,token.primaryPurchase(next.address,1,id('compra')),'RecoveryPending');
  await(await token.pause()).wait();await(await token.connect(a).cancelRecovery(a.address)).wait();
  await(await token.unpause()).wait();await buy(b,1);
  assert.equal(await token.balanceOf(b.address),2n);assert.equal(await token.recoverySource(next.address),ZeroAddress);
});
test('troca de administrador invalida anúncio anterior e exige novo prazo', async t => {
  const {token,a,next,outsider,buy,warp}=await setup(t);await buy(a,5);
  await(await token.requestRecovery(a.address,next.address,id('processo'))).wait();
  const r=await token.recoveries(a.address);await warp(Number(r.executeAfter));
  await(await token.transferOwnership(outsider.address)).wait();await(await token.connect(outsider).acceptOwnership()).wait();
  await rejects(token,token.connect(outsider).reissue(a.address,next.address),'InvalidRecovery');
  await(await token.connect(outsider).cancelRecovery(a.address)).wait();
  await(await token.connect(outsider).requestRecovery(a.address,next.address,id('novo-processo'))).wait();
  assert.ok((await token.recoveries(a.address)).executeAfter>r.executeAfter);
});
test('feedback: recupera royalties sem saldo e após expiração, preservando valores pagos', async t => {
  const {token,a,b,next,buy,warp,recover,stableMode,admin}=await setup(t,true);await buy(a,5);await buy(b,1);
  const stable=await stableMode();await(await stable.mint(admin.address,1_000_000)).wait();await(await stable.approve(await token.getAddress(),1_000_000)).wait();
  await warp(ENDS[0]);await(await token.reportRevenue(1_000_000,id('r1'))).wait();
  await(await token.connect(a).claimRoyalty(1)).wait();
  await warp(ENDS[1]);await(await token.reportRevenue(1_000_000,id('r2'))).wait();
  await(await token.simulateLegacyZeroPosition(a.address)).wait();await warp(UNTIL+1);
  await recover(a,next);
  assert.equal(await token.balanceOf(next.address),0n);assert.equal(await token.pendingRoyaltyOf(next.address),5000n);
  assert.equal(await token.royaltyPaid(1,a.address),5000n);assert.equal(await token.royaltyPaid(1,next.address),0n);
  assert.equal(await token.revoked(a.address),true);await(await token.connect(next).claimRoyalty(2)).wait();
  assert.equal(await stable.balanceOf(next.address),5000n);assert.equal(await token.pendingRoyaltyOf(a.address),0n);
  await rejects(token,token.connect(next).claimRoyalty(2),'NothingToClaim');
});
test('calendário fixa oito encerramentos civis e bloqueia esgotamento precoce', async t => {
  const {token,warp}=await setup(t);
  for(let i=0;i<8;i++) {
    assert.equal(await token.periodEnd(i+1),BigInt(ENDS[i]));await warp(ENDS[i]-1);
    await rejects(token,token.reportRevenue.staticCall(100,id('cedo')),'PeriodNotClosed');
    await warp(ENDS[i]);await(await token.reportRevenue(100,id('fechado'))).wait();
  }
  await rejects(token,token.reportRevenue(100,id('nono')),'AllPeriodsReported');
});
test('construtor rejeita supply divergente e janela que não corresponda a quatro anos civis', async t => {
  const {deploy,admin}=await setup(t);
  for(const args of [[admin.address,151,FROM,UNTIL,ZeroAddress],[admin.address,150,FROM+1,UNTIL,ZeroAddress],[admin.address,150,FROM,UNTIL-86400,ZeroAddress]]) await assert.rejects(deploy('IBIToken',args));
});
test('compra estável é atômica, usa preço fixo e credita a tesouraria', async t => {
  const {token,a,admin,stableMode}=await setup(t);const stable=await stableMode();
  const price=37_055_190000n;await(await stable.mint(a.address,price*2n)).wait();
  await(await stable.connect(a).approve(await token.getAddress(),price*2n)).wait();
  await(await token.connect(a).buyPrimary(2,id('compra-paga'))).wait();
  assert.equal(await stable.balanceOf(admin.address),price*2n);assert.equal(await token.balanceOf(a.address),2n);
  assert.equal(await stable.balanceOf(a.address),0n);assert.equal(await token.personBalance(PERSON_A),2n);
  await rejects(token,token.setPrimaryPrice(1),'PrimaryPriceAlreadySet');
  await rejects(token,token.primaryPurchase(a.address,1,id('gratis')),'StablecoinPurchaseRequired');
});
test('falha no pagamento reverte entrega e agregado pessoal', async t => {
  const {token,a,stableMode}=await setup(t);const stable=await stableMode();
  await assert.rejects(token.connect(a).buyPrimary(1,id('sem-allowance')));
  await(await stable.connect(a).approve(await token.getAddress(),37_055_190000n)).wait();
  await assert.rejects(token.connect(a).buyPrimary(1,id('sem-saldo')));
  assert.equal(await token.balanceOf(a.address),0n);assert.equal(await token.personBalance(PERSON_A),0n);assert.equal(await token.saleableUnits(),100n);
});
test('compra inválida não cobra stablecoin e preço ausente impede compra', async t => {
  const {token,a,next,deploy,buy}=await setup(t);await buy(a,20);
  const stable=await deploy('MockStablecoin',['Teste','tBRL',6]);await(await token.setStablecoin(await stable.getAddress())).wait();
  await rejects(token,token.connect(a).buyPrimary(1,id('preco-ausente')),'PrimaryPriceUnavailable');
  await(await token.setPrimaryPrice(1)).wait();await(await stable.mint(a.address,10)).wait();await(await stable.connect(a).approve(await token.getAddress(),10)).wait();
  await rejects(token,token.connect(a).buyPrimary(1,id('teto')),'WalletCapExceeded');
  await rejects(token,token.connect(next).buyPrimary(1,id('sem-cadastro')),'WalletNotRegistered');
  assert.equal(await stable.balanceOf(a.address),10n);
});
test('royalty temporal mantém funding atômico, estoque e saque individual', async t => {
  const {token,a,b,admin,buy,warp,stableMode}=await setup(t);await buy(a,20);await buy(b,10);
  const stable=await stableMode();await warp(ENDS[0]);
  await assert.rejects(token.reportRevenue(1_000_000,id('sem-funding')));assert.equal(await token.lastReportedPeriod(),0n);
  await(await stable.mint(admin.address,1_000_000)).wait();await(await stable.approve(await token.getAddress(),1_000_000)).wait();
  await(await token.reportRevenue(1_000_000,id('r1'))).wait();assert.equal(await stable.balanceOf(await token.getAddress()),150000n);
  assert.equal(await token.royaltyDue(1,admin.address),120000n);
  const payment=5n*await token.primaryUnitPrice();await(await stable.mint(b.address,payment)).wait();await(await stable.connect(b).approve(await token.getAddress(),payment)).wait();await(await token.connect(b).buyPrimary(5,id('nova-compra'))).wait();assert.equal(await token.royaltyDue(1,a.address),20000n);
  await warp(ENDS[1]);await(await token.reportRevenue(1_000_000,id('r2'))).wait();
  assert.equal(await token.royaltyDue(2,a.address),20000n);assert.equal(await token.royaltyDue(2,b.address),15000n);
  await(await token.connect(a).claimRoyalty(1)).wait();assert.equal(await stable.balanceOf(a.address),20000n);
});
test('recuperação pendente bloqueia saque e liquidação para carteira perdida', async t => {
  const {token,a,next,buy,warp}=await setup(t);await buy(a,1);await warp(ENDS[0]);await(await token.reportRevenue(1_000_000,id('r1'))).wait();
  await(await token.requestRecovery(a.address,next.address,id('processo'))).wait();
  await rejects(token,token.settleOffChain(1,a.address,id('pagamento')),'RecoveryPending');
  await(await token.cancelRecovery(a.address)).wait();await(await token.settleOffChain(1,a.address,id('pagamento'))).wait();
  assert.equal(await token.royaltyPaid(1,a.address),1000n);
});
test('pausa, expiração e autorizações permanecem eficazes', async t => {
  const {token,a,b,buy,warp}=await setup(t);await buy(a,5);await buy(b,1);
  await rejects(token,token.connect(a).pause(),'OwnableUnauthorizedAccount');
  await rejects(token,token.renounceOwnership(),'RenounceDisabled');
  await rejects(token,token.primaryPurchase(a.address,0,id('zero')),'ZeroUnits');
  await rejects(token,token.connect(a).transfer(b.address,6),'SecondaryTransfersDisabled');
  await(await token.pause()).wait();await rejects(token,token.connect(a).transfer(b.address,1),'EnforcedPause');
  await(await token.unpause()).wait();await warp(UNTIL+1);
  await rejects(token,token.connect(a).transfer(b.address,1),'TokenExpired');
  await rejects(token,token.connect(a).transfer(a.address,0),'TokenExpired');
  assert.equal(await token.isMember(a.address),false);
});
test('retorno de um ex-administrador não revalida anúncio anterior à troca', async t => {
  const {token,admin,a,next,outsider,buy,warp}=await setup(t);await buy(a,5);
  await(await token.requestRecovery(a.address,next.address,id('processo-antigo'))).wait();
  const request=await token.recoveries(a.address);
  await(await token.transferOwnership(outsider.address)).wait();await(await token.connect(outsider).acceptOwnership()).wait();
  await(await token.connect(outsider).transferOwnership(admin.address)).wait();await(await token.acceptOwnership()).wait();
  await warp(Number(request.executeAfter));
  await rejects(token,token.reissue(a.address,next.address),'InvalidRecovery');
  assert.equal(await token.balanceOf(a.address),5n);
});
test('recuperação rejeita contrato que não pode operar a posição recebida', async t => {
  const {token,a,buy,deploy}=await setup(t);await buy(a,5);
  const unusable=await deploy('MockStablecoin',['Sem acesso a IBT','OUT',6]);
  await rejects(token,token.requestRecovery(a.address,await unusable.getAddress(),id('processo')),'InvalidAddress');
});
