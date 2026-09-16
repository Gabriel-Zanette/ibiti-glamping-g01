import assert from 'node:assert/strict';
import { describe, it, before, after } from 'node:test';
import * as ethers from 'ethers';
import { localChain } from '../tools/local-chain.ts';
import { Ledger } from '../../offchain/src/ledger.ts';
import { ChainSync } from '../../offchain/src/chain.ts';
let chain: Awaited<ReturnType<typeof localChain>>;
before(async()=>{chain=await localChain();});
after(async()=>{await chain?.stop();});

describe('Hospedagens off-chain com IBIToken real', function () {
  it('compra, solicita, cancela, transfere, reemite e recebe royalty sem markRedeemed', async function () {
    const [admin, alice, bob, recovery] = chain.signers;
    const now = (await chain.provider.getBlock('latest'))!.timestamp;
    const stable = await chain.deploy('MockStablecoin', ['Teste', 'tBRL', 6]);
    const token = await chain.deploy('IBIToken', [admin.address, 150, now, now + 126230400, await stable.getAddress()]);
    const receipt = await token.deploymentTransaction()!.wait();
    const db = new Ledger(':memory:', 'integration'.repeat(8), 'local');
    const sync = new ChainSync(db, chain.provider, await token.getAddress(), receipt!.blockNumber, 31337);
    const p = db.registerPerson('52998224725'); db.setVerified(p.id, true); db.linkWallet(p.id, alice.address);
    const q = db.registerPerson('11144477735'); db.setVerified(q.id, true); db.linkWallet(q.id, bob.address);
    await (await token.primaryPurchase(alice.address, 5, ethers.id('sale-a'))).wait();
    await (await token.primaryPurchase(bob.address, 1, ethers.id('sale-b'))).wait();
    await sync.sync(); assert.equal(db.quota(p.id).available,5);
    const tomorrow = new Date((now + 86400 * 10) * 1000).toISOString().slice(0,10);
    const departure = new Date((now + 86400 * 12) * 1000).toISOString().slice(0,10);
    const r = db.requestStay(p.id, { units: 2, arrival: tomorrow, departure }, 'stay-one');
    db.transition(p.id, r.id, 'confirmed'); db.transition(p.id, r.id, 'completed');
    assert.equal(db.quota(p.id).used,2);
    assert.equal(token.interface.hasFunction('markRedeemed'),false);
    assert.equal(await token.balanceOf(alice.address),5n);
    await (await token.connect(alice).transfer(bob.address, 4)).wait(); await sync.sync();
    assert.equal(db.quota(p.id).available,0); assert.equal(db.quota(q.id).available,4);
    await sync.sync(); assert.equal(db.quota(q.id).available,4);
    const booking = db.requestStay(q.id, { units: 1, arrival: tomorrow, departure }, 'stay-b');
    db.linkWallet(q.id, recovery.address);
    await (await token.reissue(bob.address, recovery.address)).wait(); await sync.sync();
    db.transition(q.id, booking.id, 'cancelled');
    await sync.sync();
    assert.equal(db.quota(q.id).balance,5); assert.equal(db.quota(q.id).available,4);
    assert.throws(() => db.requireWallet(bob.address),new RegExp('WALLET_REVOKED'));
    await (await stable.mint(admin.address, 1_000_000)).wait(); await (await stable.approve(await token.getAddress(), 1_000_000)).wait();
    await (await token.reportRevenue(1_000_000, ethers.id('report'))).wait();
    await (await token.connect(recovery).claimRoyalty(1)).wait();
    assert.equal(await stable.balanceOf(recovery.address),5000n);
    const statement = await sync.royalties(q.id);
    assert.equal(statement.symbol,'tBRL');
    assert.equal(statement.periods[0].paid,'0.005');
    assert.equal(statement.periods[0].due,'0.0');
    await (await token.pause()).wait(); await sync.sync();
    assert.throws(() => db.requestStay(q.id, { units: 1, arrival: tomorrow, departure }, 'paused'),new RegExp('NOT_ELIGIBLE'));
    db.close();
  });
  it('rejeita rede errada e consumo legado sem migração', async function () {
    const [admin, a] = chain.signers; const now = (await chain.provider.getBlock('latest'))!.timestamp;
    const token = await chain.deploy('LegacyRedemptionFixture', [admin.address,150,now,now+126230400,ethers.ZeroAddress]);
    const receipt = await token.deploymentTransaction()!.wait();
    const db = new Ledger(':memory:', 'integration'.repeat(8), 'local');
    const invalid = new ChainSync(db, chain.provider, await token.getAddress(), receipt!.blockNumber, 11155111);
    try { await invalid.sync(); assert.fail('accepted wrong network'); } catch(e) { assert.ok(String(e).includes('WRONG_CHAIN')); }
    await (await token.primaryPurchase(a.address, 1, ethers.id('a'))).wait();
    await (await token.emitLegacyRedemption(a.address)).wait();
    const sync = new ChainSync(db, chain.provider, await token.getAddress(), receipt!.blockNumber, 31337);
    try { await sync.sync(); assert.fail('accepted legacy redemption'); } catch(e) { assert.ok(String(e).includes('LEGACY_REDEMPTIONS_REQUIRE_MIGRATION')); }
    assert.equal(db.state(),null); db.close();
  });
  it('rejeita contrato diferente e histórico iniciado depois da emissão', async function () {
    const [admin,a]=chain.signers; const now=(await chain.provider.getBlock('latest'))!.timestamp;
    const stable=await chain.deploy('MockStablecoin',['Outro','OUT',18]);
    const token=await chain.deploy('IBIToken',[admin.address,150,now,now+126230400,ethers.ZeroAddress]);
    const receipt=await token.deploymentTransaction()!.wait();
    await (await token.primaryPurchase(a.address,1,ethers.id('a'))).wait();
    const db=new Ledger(':memory:','integration'.repeat(8),'local');
    for(const [address,start,error] of [[await stable.getAddress(),0,'INCOMPATIBLE_CONTRACT'],[await token.getAddress(),receipt!.blockNumber+1,'EMISSION_NOT_FOUND_CHECK_START_BLOCK']] as const){
      try {await new ChainSync(db,chain.provider,address,start,31337).sync();assert.fail('accepted invalid source');}
      catch(e){assert.ok(String(e).includes(error));}
    }
    assert.equal(db.state(),null);db.close();
  });
  it('reorganização não apaga consumos nem reconstrói o banco silenciosamente', async function () {
    const [admin,a]=chain.signers;const now=(await chain.provider.getBlock('latest'))!.timestamp;
    const token=await chain.deploy('IBIToken',[admin.address,150,now,now+126230400,ethers.ZeroAddress]);
    const receipt=await token.deploymentTransaction()!.wait();
    const db=new Ledger(':memory:','integration'.repeat(8),'local');
    const sync=new ChainSync(db,chain.provider,await token.getAddress(),receipt!.blockNumber,31337);
    await sync.sync();const checkpointId=await chain.provider.send('evm_snapshot',[]);
    await(await token.primaryPurchase(a.address,1,ethers.id('a'))).wait();await sync.sync();
    const checkpoint=db.state();await chain.provider.send('evm_revert',[checkpointId]);
    try{await sync.sync();assert.fail('accepted reorganized chain');}catch(e){assert.ok(String(e).includes('CHAIN_REORG'));}
    assert.deepEqual(db.state(),checkpoint);db.close();
  });

  it('extrato mantém BRL de períodos antigos depois de configurar stablecoin', async function () {
    const [admin,a]=chain.signers;const now=(await chain.provider.getBlock('latest'))!.timestamp;
    const token=await chain.deploy('IBIToken',[admin.address,150,now,now+126230400,ethers.ZeroAddress]);
    const receipt=await token.deploymentTransaction()!.wait();
    await(await token.primaryPurchase(a.address,1,ethers.id('a'))).wait();
    await(await token.reportRevenue(1_000_000,ethers.id('brl'))).wait();
    const stable=await chain.deploy('MockStablecoin',['Teste','tBRL',6]);
    await(await stable.mint(admin.address,1_000_000)).wait();await(await stable.approve(await token.getAddress(),1_000_000)).wait();
    await(await token.setStablecoin(await stable.getAddress())).wait();await(await token.reportRevenue(1_000_000,ethers.id('tbrl'))).wait();
    const db=new Ledger(':memory:','integration'.repeat(8),'local');const p=db.registerPerson('52998224725');db.setVerified(p.id,true);db.linkWallet(p.id,a.address);
    const sync=new ChainSync(db,chain.provider,await token.getAddress(),receipt!.blockNumber,31337);
    const statement=await sync.royalties(p.id);
    assert.equal(statement.periods[0].symbol,'BRL');assert.equal(statement.periods[0].due,'10.0');
    assert.equal(statement.periods[1].symbol,'tBRL');assert.equal(statement.periods[1].due,'0.001');db.close();
  });

});
