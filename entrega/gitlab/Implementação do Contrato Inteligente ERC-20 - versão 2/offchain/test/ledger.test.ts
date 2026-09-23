import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Ledger } from '../src/ledger.ts';
const admin = '0x0000000000000000000000000000000000000001';
const a = '0x0000000000000000000000000000000000000002';
const b = '0x0000000000000000000000000000000000000003';
const other = '0x0000000000000000000000000000000000000004';
const zero = '0x0000000000000000000000000000000000000000';
const context = { number: 1, hash: 'block1', timestamp: 1800000000, validFrom: 1700000000, validUntil: 1900000000, paused: false, maxPerWallet: 20, owner: admin };
const secret = 'a'.repeat(64);
function fixture(path = ':memory:') {
  const db = new Ledger(path, secret, '31337:test');
  const pa = db.registerPerson('529.982.247-25');
  const pb = db.registerPerson('111.444.777-35');
  db.setVerified(pa.id, true); db.setVerified(pb.id, true);
  db.linkWallet(pa.id, a); db.linkWallet(pb.id, b);
  db.applyBlock(context, [
    { id: 'mint', from: zero, to: admin, units: 150, kind: 'emission' },
    { id: 'sale1', from: admin, to: a, units: 5, kind: 'transfer' },
    { id: 'sale2', from: admin, to: b, units: 1, kind: 'transfer' },
  ]);
  return { db, pa: pa.id, pb: pb.id };
}
function reserve(db: Ledger, person: string, units = 1, key = 'request-1') {
  return db.requestStay(person, { units, arrival: '2027-02-01', departure: '2027-02-03' }, key);
}
test('CPF normalizado identifica uma pessoa; carteira não pode ser compartilhada', () => {
  const { db, pa, pb } = fixture();
  assert.equal(db.registerPerson('52998224725').id, pa);
  assert.throws(() => db.registerPerson('11111111111'), /INVALID_CPF/);
  assert.throws(() => db.linkWallet(pb, a), /WALLET_ALREADY_LINKED/);
  assert.equal(db.quota(pa).available, 5);
  db.close();
});
test('solicitação debita, confirmação não debita outra vez e cancelamento devolve uma só vez', () => {
  const { db, pa } = fixture();
  const r = reserve(db, pa, 3);
  assert.equal(db.quota(pa).available, 2);
  assert.equal(db.quota(pa).reserved, 3);
  assert.equal(reserve(db, pa, 3).id, r.id);
  assert.throws(() => reserve(db, pa, 2), /IDEMPOTENCY_CONFLICT/);
  db.transition(pa, r.id, 'confirmed');
  assert.equal(db.quota(pa).available, 2);
  db.transition(pa, r.id, 'cancelled'); db.transition(pa, r.id, 'cancelled');
  assert.equal(db.quota(pa).pendingRelease,3);
  db.applyBlock(context,[]);
  assert.equal(db.quota(pa).available, 5);
  db.close();
});
test('persistência e duas conexões impedem gastar mais do que a cota', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ibiti-'));
  const path = join(dir, 'data.sqlite');
  const { db, pa } = fixture(path);
  const second = new Ledger(path, secret, '31337:test');
  reserve(db, pa, 4);
  assert.throws(() => reserve(second, pa, 2, 'request-2'), /INSUFFICIENT_QUOTA/);
  db.close(); second.close();
  const reopened = new Ledger(path, secret, '31337:test');
  assert.equal(reopened.quota(pa).available, 1); reopened.close();
  assert.throws(() => new Ledger(path, 'b'.repeat(64), '31337:test'), /DATABASE_CONFIG_MISMATCH/);
  rmSync(dir, { recursive: true });
});
test('uso concluído não cancela nem aumenta ao circular tokens entre pessoas', () => {
  const { db, pa, pb } = fixture();
  const r = reserve(db, pa, 4); db.transition(pa, r.id, 'confirmed'); db.transition(pa, r.id, 'completed');
  assert.throws(() => db.transition(pa, r.id, 'cancelled'), /INVALID_TRANSITION/);
  db.applyBlock({ ...context, number: 2, hash: 'block2' }, [{ id: 't1', from: a, to: b, units: 4, kind: 'transfer' }]);
  assert.equal(db.quota(pa).available, 0); assert.equal(db.quota(pb).available, 2);
  db.applyBlock({ ...context, number: 3, hash: 'block3' }, [{ id: 't2', from: b, to: a, units: 4, kind: 'transfer' }]);
  assert.equal(db.quota(pa).available, 2); assert.equal(db.quota(pb).available, 0);
  assert.equal(db.quota(pa).used, 4);
  db.close();
});
test('somar carteiras e reemitir não reinicia consumo por pessoa', () => {
  const { db, pa } = fixture();
  db.linkWallet(pa, other);
  const r = reserve(db, pa, 2); db.transition(pa, r.id, 'confirmed'); db.transition(pa, r.id, 'completed');
  db.applyBlock({ ...context, number: 2, hash: 'block2' }, [{ id: 'reissue', from: a, to: other, units: 5, kind: 'reissue' }]);
  assert.equal(db.quota(pa).balance, 5); assert.equal(db.quota(pa).available, 3); assert.equal(db.quota(pa).used, 2);
  assert.throws(() => db.requireWallet(a), /WALLET_REVOKED/);
  db.close();
});
test('transferência com reserva pendente e cancelamento não cria créditos', () => {
  const { db, pa, pb } = fixture();
  const r = reserve(db, pa, 5);
  db.applyBlock({ ...context, number: 2, hash: 'block2' }, [{ id: 't1', from: a, to: b, units: 5, kind: 'transfer' }]);
  assert.equal(db.quota(pb).available, 1);
  assert.throws(() => db.transition(pa, r.id, 'confirmed'), /NOT_ELIGIBLE/);
  db.transition(pa, r.id, 'cancelled');
  db.applyBlock({...context,number:2,hash:'block2'},[]);
  assert.equal(db.quota(pa).available, 0); assert.equal(db.quota(pa).uncommitted, 5);
  assert.equal(db.quota(pb).available, 1);
  db.close();
});
test('reprocessar bloco é idempotente e divergência de hash bloqueia', () => {
  const { db, pa } = fixture();
  db.applyBlock(context, []); assert.equal(db.quota(pa).available, 5);
  assert.throws(() => db.applyBlock({ ...context, hash: 'fork' }, []), /CHAIN_REORG/);
  db.close();
});
test('pausa, início, expiração, revogação civil, limite por pessoa e datas inválidas impedem reservas', () => {
  for (const patch of [{ paused: true }, { validFrom: 1850000000 }, { validUntil: 1750000000 }]) {
    const { db, pa } = fixture(); db.applyBlock({ ...context, ...patch, number: 2, hash: 'b2' }, []);
    assert.throws(() => reserve(db, pa), /NOT_ELIGIBLE/); db.close();
  }
  const { db, pa } = fixture();
  assert.throws(() => reserve(db, pa, 0), /INVALID_UNITS/);
  assert.throws(() => db.requestStay(pa, { units: 1, arrival: '2027-02-30', departure: '2027-03-04' }, 'date'), /INVALID_DATES/);
  assert.throws(() => db.requestStay(pa, { units: 1, arrival: '2026-01-01', departure: '2026-01-02' }, 'past'), /INVALID_DATES/);
  db.setVerified(pa, false); assert.throws(() => reserve(db, pa), /PERSON_NOT_VERIFIED/); db.setVerified(pa, true);
  db.linkWallet(pa, other);
  db.applyBlock({ ...context, number: 2, hash: 'b2' }, [{ id: 'sale3', from: admin, to: other, units: 20, kind: 'transfer' }]);
  assert.equal(db.quota(pa).balance, 25); assert.throws(() => reserve(db, pa), /PERSON_CAP_EXCEEDED/);
  db.close();
});
test('conclusão depois da chegada mantém consumo; remarcação preserva a cota e cancelamento fica independente da rede', () => {
  const { db, pa } = fixture(); const r = reserve(db, pa, 2);
  db.reschedule(pa,r.id,'2027-02-05','2027-02-07'); assert.equal(db.quota(pa).available,3);
  db.transition(pa,r.id,'confirmed');
  db.applyBlock({...context,number:2,hash:'b2',timestamp:Date.parse('2027-02-08T12:00:00Z')/1000},[]);
  db.transition(pa,r.id,'completed'); assert.equal(db.quota(pa).used,2); assert.equal(db.quota(pa).available,3); db.close();
});
test('cancelar antes de sincronizar transferência não entrega o reembolso ao destinatário', () => {
  for(const cancelFirst of [true,false]) {
    const {db,pa,pb}=fixture();const r=reserve(db,pa,5);
    if(cancelFirst) db.transition(pa,r.id,'cancelled');
    db.applyBlock({...context,number:2,hash:'b2'},[{id:'transfer-before-cancellation',from:a,to:b,units:5,kind:'transfer'}]);
    if(!cancelFirst) db.transition(pa,r.id,'cancelled');
    db.applyBlock({...context,number:2,hash:'b2'},[]);
    assert.equal(db.quota(pa).uncommitted,5);assert.equal(db.quota(pb).available,1);db.close();
  }
});
test('snapshot em andamento não libera cancelamento criado depois de sua coleta', () => {
  const {db,pa,pb}=fixture();const r=reserve(db,pa,5);const fence=db.refundFence();
  db.transition(pa,r.id,'cancelled');
  db.applyBlock(context,[],Number.MAX_SAFE_INTEGER,fence);
  assert.equal(db.quota(pa).pendingRelease,5);assert.equal(db.quota(pa).uncommitted,0);
  db.applyBlock({...context,number:2,hash:'b2'},[{id:'t1',from:a,to:b,units:5,kind:'transfer'}],Number.MAX_SAFE_INTEGER,db.refundFence());
  assert.equal(db.quota(pa).uncommitted,5);assert.equal(db.quota(pb).available,1);db.close();
});
test('troca de owner preserva tesouraria e não retira cotas de participante administrador', () => {
  const {db,pa}=fixture();
  db.applyBlock({...context,number:2,hash:'b2',owner:a,treasury:admin},[]);
  assert.equal(db.quota(pa).balance,5);assert.equal(db.quota(pa).available,5);db.close();
});
test('identidade on-chain divergente ou recuperação anunciada impedem hospedagem', () => {
  const {db,pa}=fixture();
  db.applyBlock({...context,number:2,hash:'b2',registeredWallets:[],recoveryWallets:[]},[]);
  assert.equal(db.quota(pa).available,0);
  db.applyBlock({...context,number:3,hash:'b3',registeredWallets:[a],recoveryWallets:[a]},[]);
  assert.equal(db.quota(pa).available,0);
  db.applyBlock({...context,number:4,hash:'b4',registeredWallets:[a],recoveryWallets:[]},[]);
  assert.equal(db.quota(pa).available,5);db.close();
});
test('recuperação herda cadastro e rejeita cruzar pessoas sem aplicar saldo parcialmente', () => {
  const {db,pa,pb}=fixture();
  assert.throws(()=>db.applyBlock({...context,number:2,hash:'b2'},[{id:'bad-recovery',from:a,to:b,units:5,kind:'reissue'}]),/RECOVERY_PERSON_MISMATCH/);
  assert.equal(db.quota(pa).balance,5);assert.equal(db.quota(pb).balance,1);
  db.applyBlock({...context,number:2,hash:'b2'},[{id:'recovery',from:a,to:other,units:5,kind:'reissue'}]);
  assert.equal(db.requireWallet(other),pa);assert.equal(db.quota(pa).available,5);db.close();
});
