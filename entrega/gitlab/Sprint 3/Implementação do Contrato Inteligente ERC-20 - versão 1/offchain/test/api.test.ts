import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { Wallet } from 'ethers';
import { Ledger } from '../src/ledger.ts';
import { Auth } from '../src/auth.ts';
import { createApp } from '../src/api.ts';
const adminToken = 'secret'.repeat(8);
test('API exige admin para identidade, assinatura para portador, isola pessoas e reserva uma só vez', async () => {
  const db = new Ledger(':memory:', 'x'.repeat(64), 'api');
  const auth = new Auth(db, 'http://localhost:3000', 31337);
  let online = true;
  const chain = { sync: async () => { if(!online) throw Error('CHAIN_UNAVAILABLE'); return db.state(); }, assertCurrent: async () => { if(!online) throw Error('CHAIN_UNAVAILABLE'); }, royalties: async () => ({periods:[]}) };
  const app = createApp({ ledger: db, auth, chain, adminToken, origin:'http://localhost:3000', chainId:31337, tokenAddress:'0x0000000000000000000000000000000000000001' });
  app.listen(0, '127.0.0.1'); await once(app, 'listening');
  const port=(app.address() as {port:number}).port;
  const call=async(path:string,body?:unknown,token=adminToken) => {
    const r=await fetch(`http://127.0.0.1:${port}${path}`, {method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:body===undefined?undefined:JSON.stringify(body)});
    return {status:r.status,body:await r.json() as any};
  };
  try {
    assert.equal((await call('/admin/people',{cpf:'52998224725'},'bad')).status,401);
    const p=(await call('/admin/people',{cpf:'52998224725'})).body;
    await call(`/admin/people/${p.id}/verification`,{verified:true});
    const wallet=Wallet.createRandom();
    const c=(await call(`/admin/people/${p.id}/wallet-challenge`,{wallet:wallet.address})).body;
    const token=(await call('/auth/verify',{id:c.id,signature:await wallet.signMessage(c.message)},'')).body.token;
    db.applyBlock({number:1,hash:'b1',timestamp:1800000000,validFrom:1700000000,validUntil:1900000000,paused:false,maxPerWallet:20,owner:'0x0000000000000000000000000000000000000001'},[
      {id:'mint',from:'0x0000000000000000000000000000000000000000',to:'0x0000000000000000000000000000000000000001',units:150,kind:'emission'},
      {id:'sale',from:'0x0000000000000000000000000000000000000001',to:wallet.address,units:1,kind:'transfer'}
    ]);
    assert.equal((await call('/me',undefined,token)).body.quota.available,1);
    assert.equal((await call(`/admin/people/${p.id}`,undefined,token)).status,401);
    const input={units:1,arrival:'2027-02-01',departure:'2027-02-03',idempotencyKey:'one'};
    const results=await Promise.all([call('/me/stays',input,token),call('/me/stays',{...input,idempotencyKey:'two'},token)]);
    assert.deepEqual(results.map(r=>r.status).sort(),[201,409]);
    const stay=results.find(r=>r.status===201)!.body;
    assert.equal((await call(`/me/stays/${stay.id}/confirmed`,{},token)).status,403);
    online=false;
    assert.equal((await call('/me/stays',{...input,idempotencyKey:'three'},token)).status,503);
    assert.equal((await call(`/me/stays/${stay.id}/cancelled`,{},token)).status,200);
    assert.equal(db.quota(p.id).available,0);
    assert.equal(db.quota(p.id).pendingRelease,1);
    db.applyBlock(db.state()!,[]);
    assert.equal(db.quota(p.id).available,1);
    const other=(await call('/admin/people',{cpf:'11144477735'})).body;
    assert.equal((await call(`/admin/people/${other.id}/stays/${stay.id}/cancelled`,{})).status,404);
    const malformed=await fetch(`http://127.0.0.1:${port}/auth/verify`,{method:'POST',headers:{'Content-Type':'application/json'},body:'null'});
    assert.equal(malformed.status,400);
  } finally { app.close(); await once(app,'close'); db.close(); }
});
