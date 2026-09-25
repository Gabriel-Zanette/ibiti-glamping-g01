import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { getAddress, verifyMessage } from 'ethers';
import { address, ensure, Ledger } from './ledger.ts';
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
export class Auth {
  ledger: Ledger;
  origin: string;
  chainId: number;
  constructor(ledger: Ledger, origin: string, chainId: number) {
    this.ledger = ledger; this.origin = new URL(origin).origin; this.chainId = chainId;
  }
  // personId só chega aqui pela rota administrativa. Login público não escolhe identidade.
  challenge(wallet: string, personId?: string) {
    const w = address(wallet);
    if (personId) ensure(this.ledger.person(personId).verified, 'PERSON_NOT_VERIFIED');
    else this.ledger.requireWallet(w);
    const id = randomUUID(); const now = Date.now(); const expires = now + 300_000;
    const nonce = randomBytes(24).toString('hex');
    const message = `${this.origin} wants you to sign in with your Ethereum account:\n${getAddress(w)}\n\n${personId ? 'Vincular esta carteira ao cadastro verificado no Passaporte IBITI.' : 'Acessar o Passaporte IBITI.'}\n\nURI: ${this.origin}\nVersion: 1\nChain ID: ${this.chainId}\nNonce: ${nonce}\nIssued At: ${new Date(now).toISOString()}\nExpiration Time: ${new Date(expires).toISOString()}\nRequest ID: ${id}`;
    this.ledger.db.prepare('DELETE FROM challenges WHERE expires<?').run(now);
    this.ledger.db.prepare('INSERT INTO challenges(id,wallet,person_id,message,expires) VALUES (?,?,?,?,?)').run(id, w, personId ?? null, message, expires);
    return { id, message, expires };
  }
  verify(id: string, signature: string) {
    return this.ledger.transaction(() => {
      const c = this.ledger.db.prepare('SELECT * FROM challenges WHERE id=?').get(id) as { wallet: string; person_id: string | null; message: string; expires: number; used: number } | undefined;
      ensure(c && !c.used && c.expires > Date.now(), 'CHALLENGE_INVALID');
      ensure(c.message.startsWith(`${this.origin} wants you to sign in with your Ethereum account:\n`) && c.message.includes(`\nChain ID: ${this.chainId}\n`), 'CHALLENGE_SCOPE_MISMATCH');
      let signer: string;
      try { signer = address(verifyMessage(c.message, signature)); } catch { throw new Error('INVALID_SIGNATURE'); }
      ensure(signer === c.wallet, 'INVALID_SIGNATURE');
      if (c.person_id) this.ledger.linkWalletInTransaction(c.person_id, signer);
      const person = this.ledger.requireWallet(signer);
      this.ledger.db.prepare('UPDATE challenges SET used=1 WHERE id=?').run(id);
      const token = randomBytes(32).toString('base64url');
      this.ledger.db.prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());
      this.ledger.db.prepare('INSERT INTO sessions VALUES (?,?,?,?)').run(hash(token), signer, person, Date.now() + 3_600_000);
      this.ledger.audit('session.created', { personId: person, wallet: signer }); return token;
    });
  }
  session(token: string) {
    const s = this.ledger.db.prepare('SELECT * FROM sessions WHERE hash=? AND expires>?').get(hash(token), Date.now()) as { wallet: string; person_id: string } | undefined;
    ensure(s, 'UNAUTHORIZED'); ensure(this.ledger.requireWallet(s.wallet) === s.person_id, 'UNAUTHORIZED');
    return { personId: s.person_id, wallet: s.wallet };
  }
  logout(token: string) { this.ledger.db.prepare('DELETE FROM sessions WHERE hash=?').run(hash(token)); }
}
