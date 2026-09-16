import { DatabaseSync } from 'node:sqlite';
import { createHmac, randomUUID } from 'node:crypto';
import { getAddress } from 'ethers';

export type ChainState = { number: number; hash: string; timestamp: number; validFrom: number; validUntil: number; paused: boolean; maxPerWallet: number; owner: string };
export type Movement = { id: string; from: string; to: string; units: number; kind: 'emission' | 'transfer' | 'reissue' };
export type StayInput = { units: number; arrival: string; departure: string };
export type StayStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';
type Person = { id: string; verified: number };
type WalletRow = { address: string; person_id: string | null; balance: number; credits: number; revoked: number };
export type Stay = StayInput & { id: string; person_id: string; status: StayStatus; request_key: string; fingerprint: string };
const ZERO = '0x0000000000000000000000000000000000000000';
export function address(value: string) { try { const a = getAddress(value).toLowerCase(); if (a === ZERO) throw Error(); return a; } catch { throw new Error('INVALID_WALLET'); } }
export function ensure(condition: unknown, code: string): asserts condition { if (!condition) throw new Error(code); }
export function positive(value: number) { ensure(Number.isSafeInteger(value) && value > 0 && value <= 150, 'INVALID_UNITS'); }
function cpfKey(cpf: string, secret: string) {
  ensure(typeof cpf === 'string' && /^[\d.\-\s]+$/.test(cpf), 'INVALID_CPF');
  const digits = cpf.replace(/\D/g, '');
  ensure(digits.length === 11 && !/^(\d)\1{10}$/.test(digits), 'INVALID_CPF');
  for (let size = 9; size <= 10; size++) {
    const sum = [...digits.slice(0, size)].reduce((n, d, i) => n + Number(d) * (size + 1 - i), 0);
    const check = (sum * 10) % 11;
    ensure(Number(digits[size]) === (check === 10 ? 0 : check), 'INVALID_CPF');
  }
  return createHmac('sha256', secret).update(digits).digest('hex');
}

export class Ledger {
  db: DatabaseSync;
  secret: string;
  constructor(path: string, secret: string, scope: string) {
    ensure(secret.length >= 32, 'IDENTITY_SECRET_TOO_SHORT');
    this.secret = secret;
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS people (id TEXT PRIMARY KEY, identity_key TEXT UNIQUE NOT NULL, verified INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS wallets (address TEXT PRIMARY KEY, person_id TEXT REFERENCES people(id), balance INTEGER NOT NULL DEFAULT 0 CHECK(balance>=0), credits INTEGER NOT NULL DEFAULT 0 CHECK(credits>=0), revoked INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS movements (id TEXT PRIMARY KEY, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS stays (id TEXT PRIMARY KEY, person_id TEXT NOT NULL REFERENCES people(id), units INTEGER NOT NULL CHECK(units>0), arrival TEXT NOT NULL, departure TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('requested','confirmed','completed','cancelled')), request_key TEXT NOT NULL, fingerprint TEXT NOT NULL, UNIQUE(person_id,request_key));
      CREATE TABLE IF NOT EXISTS allocations (stay_id TEXT NOT NULL REFERENCES stays(id), wallet TEXT NOT NULL REFERENCES wallets(address), units INTEGER NOT NULL CHECK(units>0));
      CREATE TABLE IF NOT EXISTS cancellation_refunds (stay_id TEXT PRIMARY KEY REFERENCES stays(id), ready_after INTEGER NOT NULL, released INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS audit (seq INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, action TEXT NOT NULL, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS challenges (id TEXT PRIMARY KEY, wallet TEXT NOT NULL, person_id TEXT REFERENCES people(id), message TEXT NOT NULL, expires INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, wallet TEXT NOT NULL, person_id TEXT NOT NULL REFERENCES people(id), expires INTEGER NOT NULL);
    `);
    const config = createHmac('sha256', secret).update('ibiti-ledger-v1:' + scope).digest('hex');
    const old = this.meta('config');
    if (old && old !== config) { this.db.close(); throw new Error('DATABASE_CONFIG_MISMATCH'); }
    this.db.prepare('INSERT OR IGNORE INTO metadata VALUES (?,?)').run('config', config);
  }
  close() { this.db.close(); }
  transaction<T>(fn: () => T): T {
    this.db.exec('BEGIN IMMEDIATE');
    try { const result = fn(); this.db.exec('COMMIT'); return result; }
    catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  meta(key: string) { return (this.db.prepare('SELECT value FROM metadata WHERE key=?').get(key) as { value: string } | undefined)?.value; }
  audit(action: string, data: unknown) { this.db.prepare('INSERT INTO audit(at,action,data) VALUES (?,?,?)').run(new Date().toISOString(), action, JSON.stringify(data)); }
  state(): ChainState | null { const v = this.meta('chain'); return v ? JSON.parse(v) : null; }
  person(id: string): Person {
    const p = this.db.prepare('SELECT id,verified FROM people WHERE id=?').get(id) as Person | undefined;
    ensure(p, 'PERSON_NOT_FOUND'); return p;
  }
  registerPerson(cpf: string): Person {
    const key = cpfKey(cpf, this.secret);
    return this.transaction(() => {
      const existing = this.db.prepare('SELECT id,verified FROM people WHERE identity_key=?').get(key) as Person | undefined;
      if (existing) return existing;
      const id = randomUUID(); this.db.prepare('INSERT INTO people(id,identity_key) VALUES (?,?)').run(id, key);
      this.audit('person.created', { id }); return { id, verified: 0 };
    });
  }
  setVerified(id: string, verified: boolean) {
    this.person(id); ensure(typeof verified === 'boolean', 'INVALID_VERIFICATION');
    this.transaction(() => { this.db.prepare('UPDATE people SET verified=? WHERE id=?').run(Number(verified), id); this.audit('person.verified', { id, verified }); });
  }
  wallet(value: string): WalletRow {
    const a = address(value);
    this.db.prepare('INSERT OR IGNORE INTO wallets(address) VALUES (?)').run(a);
    return this.db.prepare('SELECT * FROM wallets WHERE address=?').get(a) as WalletRow;
  }
  linkWallet(personId: string, value: string) {
    return this.transaction(() => this.linkWalletInTransaction(personId, value));
  }
  linkWalletInTransaction(personId: string, value: string) {
    ensure(this.person(personId).verified, 'PERSON_NOT_VERIFIED');
    const w = this.wallet(value);
    ensure(!w.revoked, 'WALLET_REVOKED');
    ensure(!w.person_id || w.person_id === personId, 'WALLET_ALREADY_LINKED');
    this.db.prepare('UPDATE wallets SET person_id=? WHERE address=?').run(personId, w.address);
    this.audit('wallet.linked', { personId, wallet: w.address });
    return { personId, wallet: w.address };
  }
  requireWallet(value: string) {
    const w = this.wallet(value); ensure(!w.revoked, 'WALLET_REVOKED'); ensure(w.person_id, 'WALLET_NOT_LINKED');
    ensure(this.person(w.person_id).verified, 'PERSON_NOT_VERIFIED'); return w.person_id;
  }
  wallets(person: string) { return this.db.prepare('SELECT * FROM wallets WHERE person_id=? ORDER BY address').all(person) as WalletRow[]; }
  refundFence(): number {
    return Number((this.db.prepare('SELECT COALESCE(MAX(rowid),0) AS boundary FROM cancellation_refunds').get() as {boundary:number}).boundary);
  }
  applyBlock(state: ChainState, movements: Movement[], refundThrough = state.timestamp * 1000, refundFence = Number.MAX_SAFE_INTEGER) {
    this.transaction(() => {
      const previous = this.state();
      if (previous && state.number <= previous.number) {
        ensure(state.number === previous.number && state.hash === previous.hash, 'CHAIN_REORG');
        this.releaseRefunds(refundThrough,refundFence); return;
      }
      for (const m of movements) {
        ensure(Number.isSafeInteger(m.units) && m.units >= 0 && m.units <= 150, 'INVALID_CHAIN_UNITS');
        const known = this.db.prepare('SELECT data FROM movements WHERE id=?').get(m.id) as { data: string } | undefined;
        if (known) { ensure(known.data === JSON.stringify(m), 'CHAIN_REORG'); continue; }
        const to = this.wallet(m.to);
        if (m.kind === 'emission') {
          ensure(!this.meta('emitted') && m.from === ZERO && m.units === 150, 'INVALID_EMISSION');
          this.db.prepare('UPDATE wallets SET balance=balance+?, credits=credits+? WHERE address=?').run(m.units, m.units, to.address);
          this.db.prepare('INSERT INTO metadata VALUES (?,?)').run('emitted', 'true');
        } else {
          const from = this.wallet(m.from); ensure(from.balance >= m.units, 'CHAIN_BALANCE_MISMATCH');
          if (from.address !== to.address) {
            const moved = m.kind === 'reissue' ? from.credits : Math.min(from.credits, m.units);
            this.db.prepare('UPDATE wallets SET balance=balance-?, credits=credits-? WHERE address=?').run(m.units, moved, from.address);
            this.db.prepare('UPDATE wallets SET balance=balance+?, credits=credits+? WHERE address=?').run(m.units, moved, to.address);
            if (m.kind === 'reissue') {
              ensure(this.wallet(from.address).balance === 0, 'INVALID_REISSUE');
              this.db.prepare('UPDATE wallets SET revoked=1 WHERE address=?').run(from.address);
              this.db.prepare('UPDATE allocations SET wallet=? WHERE wallet=?').run(to.address, from.address);
              this.db.prepare('DELETE FROM sessions WHERE wallet=?').run(from.address);
            }
          }
        }
        this.db.prepare('INSERT INTO movements VALUES (?,?)').run(m.id, JSON.stringify(m));
      }
      this.db.prepare('INSERT INTO metadata VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run('chain', JSON.stringify(state));
      this.releaseRefunds(refundThrough,refundFence);
      this.audit('chain.synced', { number: state.number, hash: state.hash, movements: movements.length });
    });
  }
  private releaseRefunds(through: number, fence: number) {
    const pending = this.db.prepare('SELECT stay_id FROM cancellation_refunds WHERE released=0 AND ready_after<=? AND rowid<=?').all(through,fence) as {stay_id:string}[];
    for (const refund of pending) {
      for (const alloc of this.db.prepare('SELECT wallet,units FROM allocations WHERE stay_id=?').all(refund.stay_id) as {wallet:string;units:number}[]) {
        this.db.prepare('UPDATE wallets SET credits=credits+? WHERE address=?').run(alloc.units,alloc.wallet);
      }
      this.db.prepare('UPDATE cancellation_refunds SET released=1 WHERE stay_id=?').run(refund.stay_id);
      this.audit('stay.refunded',{id:refund.stay_id});
    }
  }
  quota(personId: string) {
    const p = this.person(personId); const s = this.state();
    const wallets = this.wallets(personId).filter(w => !w.revoked && w.address !== s?.owner.toLowerCase());
    const balance = wallets.reduce((n, w) => n + w.balance, 0);
    const uncommitted = wallets.reduce((n, w) => n + w.credits, 0);
    const stays = this.stays(personId);
    const reserved = stays.filter(r => r.status === 'requested' || r.status === 'confirmed').reduce((n, r) => n + r.units, 0);
    const used = stays.filter(r => r.status === 'completed').reduce((n, r) => n + r.units, 0);
    const pendingRelease = Number((this.db.prepare('SELECT COALESCE(SUM(s.units),0) AS units FROM cancellation_refunds r JOIN stays s ON s.id=r.stay_id WHERE r.released=0 AND s.person_id=?').get(personId) as {units:number}).units);
    const member = Boolean(p.verified && s && s.timestamp <= s.validUntil && balance > 0);
    const eligible = member && s !== null && s.timestamp >= s.validFrom && !s.paused && balance <= s.maxPerWallet;
    const available = eligible ? Math.max(0, Math.min(uncommitted, balance - reserved)) : 0;
    return { personId, balance, available, uncommitted, reserved, used, pendingRelease, member, eligible, block: s?.number ?? null, wallets: wallets.map(w => w.address) };
  }
  assertEligible(personId: string) {
    ensure(this.person(personId).verified, 'PERSON_NOT_VERIFIED');
    const q = this.quota(personId); const s = this.state();
    ensure(s, 'CHAIN_NOT_SYNCED'); ensure(q.balance <= s.maxPerWallet, 'PERSON_CAP_EXCEEDED'); ensure(q.eligible, 'NOT_ELIGIBLE');
    return q;
  }
  dates(input: StayInput) {
    const s = this.state(); ensure(s, 'CHAIN_NOT_SYNCED');
    const parse = (date: string) => {
      ensure(typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date), 'INVALID_DATES');
      const ms = Date.parse(date + 'T00:00:00Z'); ensure(Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === date, 'INVALID_DATES'); return ms / 1000;
    };
    const start = parse(input.arrival), end = parse(input.departure);
    ensure(start >= Math.max(s.validFrom, Math.floor(s.timestamp / 86400) * 86400) && start < end && end <= s.validUntil, 'INVALID_DATES');
  }
  requestStay(personId: string, input: StayInput, key: string): Stay {
    positive(input.units); ensure(typeof key === 'string' && /^[\w-]{1,100}$/.test(key), 'INVALID_IDEMPOTENCY_KEY');
    const fingerprint = JSON.stringify([input.units, input.arrival, input.departure]);
    return this.transaction(() => {
      const existing = this.db.prepare('SELECT * FROM stays WHERE person_id=? AND request_key=?').get(personId, key) as Stay | undefined;
      if (existing) { ensure(existing.fingerprint === fingerprint, 'IDEMPOTENCY_CONFLICT'); return existing; }
      const q = this.assertEligible(personId); this.dates(input);
      ensure(q.available >= input.units, 'INSUFFICIENT_QUOTA');
      const id = randomUUID();
      this.db.prepare("INSERT INTO stays VALUES (?,?,?,?,?, 'requested',?,?)").run(id, personId, input.units, input.arrival, input.departure, key, fingerprint);
      let left = input.units;
      for (const w of this.wallets(personId).filter(w => !w.revoked && q.wallets.includes(w.address))) {
        const n = Math.min(left, w.credits); if (!n) continue;
        this.db.prepare('UPDATE wallets SET credits=credits-? WHERE address=?').run(n, w.address);
        this.db.prepare('INSERT INTO allocations VALUES (?,?,?)').run(id, w.address, n); left -= n;
      }
      ensure(left === 0, 'INSUFFICIENT_QUOTA');
      this.audit('stay.requested', { id, personId, ...input, block: q.block }); return this.stay(personId, id);
    });
  }
  stay(personId: string, id: string) {
    const r = this.db.prepare('SELECT * FROM stays WHERE id=? AND person_id=?').get(id, personId) as Stay | undefined;
    ensure(r, 'STAY_NOT_FOUND'); return r;
  }
  stays(personId: string) { this.person(personId); return this.db.prepare('SELECT * FROM stays WHERE person_id=? ORDER BY rowid DESC').all(personId) as Stay[]; }
  transition(personId: string, id: string, status: StayStatus) {
    return this.transaction(() => {
      const r = this.stay(personId, id); if (r.status === status) return r;
      const allowed: Record<StayStatus, StayStatus[]> = { requested: ['confirmed', 'cancelled'], confirmed: ['completed', 'cancelled'], completed: [], cancelled: [] };
      ensure(allowed[r.status].includes(status), 'INVALID_TRANSITION');
      if (status !== 'cancelled') {
        const q = this.assertEligible(personId); ensure(q.balance >= q.reserved, 'NOT_ELIGIBLE');
        // Concluir uma hospedagem já iniciada não é solicitar uma nova data.
        if (status === 'confirmed') this.dates(r);
      }
      else {
        // Nunca devolver créditos transferíveis sobre um snapshot anterior ao cancelamento.
        // A sincronização aplica as movimentações primeiro e só então libera a devolução.
        this.db.prepare('INSERT INTO cancellation_refunds(stay_id,ready_after) VALUES (?,?)').run(id,Date.now());
      }
      this.db.prepare('UPDATE stays SET status=? WHERE id=?').run(status, id);
      this.audit('stay.' + status, { id, personId }); return this.stay(personId, id);
    });
  }
  reschedule(personId: string, id: string, arrival: string, departure: string) {
    return this.transaction(() => {
      const r = this.stay(personId, id); ensure(['requested', 'confirmed'].includes(r.status), 'INVALID_TRANSITION');
      this.assertEligible(personId); this.dates({ ...r, arrival, departure });
      this.db.prepare('UPDATE stays SET arrival=?,departure=? WHERE id=?').run(arrival, departure, id);
      this.audit('stay.rescheduled', { id, personId, arrival, departure }); return this.stay(personId, id);
    });
  }
}
