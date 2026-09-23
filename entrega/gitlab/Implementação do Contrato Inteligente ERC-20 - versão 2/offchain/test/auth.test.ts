import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Wallet } from 'ethers';
import { Ledger } from '../src/ledger.ts';
import { Auth } from '../src/auth.ts';
const secret = 'x'.repeat(64);
function setup() {
  const db = new Ledger(':memory:', secret, 'test');
  const p = db.registerPerson('52998224725'); db.setVerified(p.id, true);
  const auth = new Auth(db, 'http://localhost:3000', 31337);
  return { db, p: p.id, auth, wallet: Wallet.createRandom() };
}
test('vínculo exige assinatura do desafio e sessão só acessa a pessoa vinculada', async () => {
  const { db, p, auth, wallet } = setup();
  const c = auth.challenge(wallet.address, p);
  const token = auth.verify(c.id, await wallet.signMessage(c.message));
  assert.equal(auth.session(token).personId, p);
  assert.throws(() => auth.verify(c.id, '0x'), /CHALLENGE_INVALID/);
  assert.throws(() => auth.session('invalido'), /UNAUTHORIZED/);
  db.setVerified(p, false); assert.throws(() => auth.session(token), /PERSON_NOT_VERIFIED/);
  db.close();
});
test('assinatura de outra carteira e desafio expirado são recusados', async () => {
  const { db, p, auth, wallet } = setup();
  const c = auth.challenge(wallet.address, p);
  await assert.rejects(async () => auth.verify(c.id, await Wallet.createRandom().signMessage(c.message)), /INVALID_SIGNATURE/);
  db.db.prepare('UPDATE challenges SET expires=0 WHERE id=?').run(c.id);
  await assert.rejects(async () => auth.verify(c.id, await wallet.signMessage(c.message)), /CHALLENGE_INVALID/);
  db.close();
});
test('login não vincula carteira desconhecida nem aceita mensagem adulterada', async () => {
  const { db, p, auth, wallet } = setup();
  assert.throws(() => auth.challenge(wallet.address), /WALLET_NOT_LINKED/);
  const c = auth.challenge(wallet.address, p);
  await assert.rejects(async () => auth.verify(c.id, await wallet.signMessage(c.message.replace('31337', '1'))), /INVALID_SIGNATURE/);
  const token = auth.verify(c.id, await wallet.signMessage(c.message));
  auth.logout(token); assert.throws(() => auth.session(token), /UNAUTHORIZED/);
  db.close();
});
test('desafio emitido para outra origem não autentica no serviço atual', async () => {
  const {db,p,auth,wallet}=setup();const c=auth.challenge(wallet.address,p);
  const changed=new Auth(db,'http://localhost:4000',31337);
  await assert.rejects(async()=>changed.verify(c.id,await wallet.signMessage(c.message)),/CHALLENGE_SCOPE_MISMATCH/);db.close();
});
