import { test } from 'node:test';
import assert from 'node:assert/strict';
import { id, ZeroAddress, Wallet } from 'ethers';
import { localChain } from '../tools/local-chain.ts';
const stamp=(s:string)=>Date.parse(s)/1000;
async function fixture(t:any,from=stamp('2027-08-31T15:00:00Z'),until=stamp('2031-08-31T15:00:00Z')-1) {
 const c=await localChain();t.after(()=>c.stop());
 await c.provider.send('anvil_setBlockTimestampInterval',[0]);
 const [admin,a,b,replacement]=c.signers;
 const token=await c.deploy('IBIToken',[admin.address,150,from,until,ZeroAddress]);
 for(const w of [a,b]) await(await token.registerWallet(w.address,id(w.address))).wait();
 const warp=async(n:number)=>{await c.provider.send('evm_setNextBlockTimestamp',[n]);await c.provider.send('evm_mine',[]);};
 const buy=async(w:any,n:number)=>{const r=await(await token.primaryPurchase(w.address,n,id('sale'))).wait();return (await c.provider.getBlock(r.blockNumber))!.timestamp;};
 return {...c,admin,a,b,replacement,token,warp,buy,from};
}
test('abertura única, sem pré-venda, sem semestre antecipado e datas ancoradas em meses civis',async t=>{
 const c=await fixture(t,0,0);const {token,a,admin,warp}=c;
 await assert.rejects(token.primaryPurchase(a.address,1,id('pre')));
 await assert.rejects(token.reportRevenue(100,id('pre')));
 assert.equal(await token.isMember(admin.address),false);assert.equal(await token.isExpired(),false);
 const opened=stamp('2027-08-31T15:00:00Z');await warp(opened);
 await assert.rejects(token.connect(a).recordOpening(opened,id('opening')));
 await assert.rejects(token.recordOpening(opened+86400,id('future')));
 await(await token.recordOpening(opened,id('opening'))).wait();
 assert.equal(await token.validUntil(),BigInt(stamp('2031-08-31T15:00:00Z')-1));
 assert.equal(await token.periodEnd(1),BigInt(stamp('2028-02-29T15:00:00Z')));
 assert.equal(await token.periodEnd(2),BigInt(stamp('2028-08-31T15:00:00Z')));
 assert.equal(await token.periodEnd(3),BigInt(stamp('2029-02-28T15:00:00Z')));
 await assert.rejects(token.recordOpening(opened,id('again')));
 await c.buy(a,1);await assert.rejects(token.reportRevenue(100,id('early')));
});
test('cinco tokens desde a compra e mais um no último dia: peso exato, reporte tardio não muda o corte',async t=>{
 const {token,a,b,admin,warp,buy,from}=await fixture(t);
 await assert.rejects(token.primaryPurchase(a.address,1,id('early')));
 await warp(from);const bought=await buy(a,5);const end=Number(await token.periodEnd(1));
 await warp(end-86400);const late=await buy(a,1);
 await warp(end);const expected=5n*BigInt(end-bought)+BigInt(end-late);
 assert.equal(await token.tokenSecondsOf(1,a.address),expected);
 await warp(end+86400*30);await buy(b,10);
 assert.equal(await token.tokenSecondsOf(1,b.address),0n);
 assert.equal(await token.tokenSecondsOf(1,a.address),expected);
 await(await token.reportRevenue(1_000_000,id('report'))).wait();
 const denominator=150n*BigInt(end-from), due=150_000n*expected/denominator;
 assert.equal(await token.royaltyDue(1,a.address),due);assert.ok(due<6000n && due>=5000n);
 assert.equal(await token.royaltyDue(1,b.address),0n);
 assert.equal(await token.tokenSecondsOf(1,admin.address)+expected,denominator);
 const info=await token.periodInfo(1);assert.ok(info.totalDue<=150000n && info.totalDue>=149999n);
});
test('recuperação leva pesos não apurados e recebíveis, preservando pagamentos históricos sem duplicar tempo',async t=>{
 const {token,a,replacement,admin,warp,buy,from}=await fixture(t);
 await warp(from);const bought=await buy(a,5);const end=Number(await token.periodEnd(1));
 await warp(end+100);await(await token.requestRecovery(a.address,replacement.address,id('case'))).wait();
 const r=await token.recoveries(a.address);assert.equal(await token.RECOVERY_DELAY(),604800n);
 await warp(Number(r.executeAfter));await(await token.reissue(a.address,replacement.address)).wait();
 const weight=5n*BigInt(end-bought);assert.equal(await token.tokenSecondsOf(1,a.address),0n);
 assert.equal(await token.tokenSecondsOf(1,replacement.address),weight);
 await(await token.reportRevenue(1_000_000,id('r1'))).wait();assert.equal(await token.royaltyDue(1,a.address),0n);
 assert.equal(await token.royaltyDue(1,replacement.address),150000n*weight/(150n*BigInt(end-from)));
 const end2=Number(await token.periodEnd(2));await warp(end2);
 assert.equal(await token.tokenSecondsOf(2,replacement.address),5n*BigInt(end2-end));
 assert.equal(await token.tokenSecondsOf(2,admin.address)+await token.tokenSecondsOf(2,replacement.address),150n*BigInt(end2-end));
 await(await token.reportRevenue(1_000_000,id('r2'))).wait();assert.equal(await token.royaltyDue(2,replacement.address),5000n);
});
test('tesouraria com saldo zero conserva royalty do estoque mantido antes da venda integral',async t=>{
 const {token,a,admin,warp,buy,from}=await fixture(t);
 await warp(from+86400*45);await(await token.reduceReserve(0)).wait();
 const wallets=[a,...Array.from({length:7},()=>Wallet.createRandom())];
 for(let i=0;i<wallets.length;i++){
  const w=wallets[i];if(i)await(await token.registerWallet(w.address,id(w.address))).wait();
  await buy(w,i===7?10:20);
 }
 assert.equal(await token.balanceOf(admin.address),0n);const end=Number(await token.periodEnd(1));await warp(end);
 const weight=await token.tokenSecondsOf(1,admin.address);assert.ok(weight>0n);
 let sum=weight;for(const w of wallets)sum+=await token.tokenSecondsOf(1,w.address);
 assert.equal(sum,150n*BigInt(end-from));
 await(await token.reportRevenue(1_000_000,id('all-sold'))).wait();
 assert.equal(await token.royaltyDue(1,admin.address),150000n*weight/sum);
});
test('sem transferência entre participantes, entre carteiras da mesma pessoa ou por allowance; recuperação continua permitida',async t=>{
 const {token,a,b,admin,warp,buy,from}=await fixture(t);await warp(from);await buy(a,5);await buy(b,1);
 for(const to of [a.address,b.address,admin.address])await assert.rejects(token.connect(a).transfer(to,1));
 await(await token.connect(a).approve(b.address,5)).wait();await assert.rejects(token.connect(b).transferFrom(a.address,b.address,5));
 assert.equal(await token.allowance(a.address,b.address),5n);assert.equal(await token.balanceOf(a.address),5n);
});
test('29 de fevereiro mantém aniversário original e bloqueia compras após quatro anos',async t=>{
 const from=stamp('2028-02-29T10:30:00Z'),until=stamp('2032-02-29T10:30:00Z')-1;
 const {token,a,warp,buy}=await fixture(t,from,until);
 assert.equal(await token.periodEnd(2),BigInt(stamp('2029-02-28T10:30:00Z')));
 assert.equal(await token.periodEnd(8),BigInt(until+1));await warp(from);await buy(a,1);
 for(let p=1;p<=8;p++){
  const end=Number(await token.periodEnd(p));await warp(end-1);await assert.rejects(token.reportRevenue.staticCall(100,id('early')));
  await warp(end);await(await token.reportRevenue(100,id('closed'))).wait();
 }
 await assert.rejects(token.reportRevenue(100,id('ninth')));await assert.rejects(token.primaryPurchase(a.address,1,id('expired')));
 assert.equal(await token.isMember(a.address),false);
});
test('apuração atrasada com 150 titulares permanece abaixo de 2^24 gas por transação',async t=>{
 const {token,admin,warp,from}=await fixture(t);await warp(from+45*86400);
 await(await token.reduceReserve(0)).wait();
 for(let i=1;i<=150;i++){
  const wallet='0x'+(0x10000+i).toString(16).padStart(40,'0');
  await(await token.registerWallet(wallet,id('gas-person-'+i))).wait();
  await(await token.primaryPurchase(wallet,1,id('gas-sale-'+i))).wait();
 }
 assert.equal(await token.holderCount(),150n);assert.equal(await token.balanceOf(admin.address),0n);
 await warp(Number(await token.validUntil())+86400);
 for(const period of [1,2]){
  const gas=await token.reportRevenue.estimateGas(1_000_000,id('late-'+period));
  assert.ok(gas<16_777_216n,`gas: ${gas}`);
  const receipt=await(await token.reportRevenue(1_000_000,id('late-'+period),{gasLimit:16_777_216})).wait();
  assert.ok(receipt.gasUsed<16_777_216n);assert.equal(await token.lastReportedPeriod(),BigInt(period));
 }
});
