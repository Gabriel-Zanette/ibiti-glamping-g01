import {
  randomBytes,
  randomUUID,
  createHash,
  createCipheriv,
  createDecipheriv,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { Ledger, ensure, cpfKey } from "./ledger.ts";
const derive = promisify(scrypt);
const digest = (s: string) => createHash("sha256").update(s).digest("hex");
export const CHECKLIST = [
  "identity",
  "contact",
  "complete",
  "rights",
  "limit",
  "review",
] as const;
export const CUSTODY = ["ibiti", "assisted", "direct"] as const;
export type Role =
  | "member"
  | "cadastro"
  | "financeiro"
  | "atendimento"
  | "supervisao";
export type Account = {
  id: string;
  personId: string | null;
  name: string;
  email: string;
  role: Role;
};
type AccountRow = {
  id: string;
  person_id: string | null;
  name: string;
  email: string;
  role: Role;
  password: string;
};
type Application = {
  person_id: string;
  phone: string;
  units: number;
  custody: string;
  status: string;
  version: number;
  submitted_at: string;
  due_date: string;
  pause_at: string | null;
  message: string;
  checklist: string;
  reason: string;
};
const safeAccount = (r: AccountRow): Account => ({
  id: r.id,
  personId: r.person_id,
  name: r.name,
  email: r.email,
  role: r.role,
});
const dateBR = (s: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(s));
const isBusiness = (date: string, holidays: string[]) =>
  ![0, 6].includes(new Date(date + "T12:00:00Z").getUTCDay()) &&
  !holidays.includes(date);
export function deadline(start: string, days: number, holidays: string[] = []) {
  let date = dateBR(start);
  while (days > 0) {
    date = new Date(Date.parse(date + "T12:00:00Z") + 86400000)
      .toISOString()
      .slice(0, 10);
    if (isBusiness(date, holidays)) days--;
  }
  return date;
}
function pausedDays(start: string, end: string, holidays: string[]) {
  let date = dateBR(start),
    count = 0;
  const stop = dateBR(end);
  while (date < stop) {
    date = new Date(Date.parse(date + "T12:00:00Z") + 86400000)
      .toISOString()
      .slice(0, 10);
    if (isBusiness(date, holidays)) count++;
  }
  return count;
}
export function field(v: unknown, max = 300) {
  ensure(
    typeof v === "string" && v.trim().length > 0 && v.length <= max,
    "INVALID_INPUT",
  );
  return v.trim();
}
function email(v: unknown) {
  const s = field(v, 254).toLowerCase();
  ensure(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s), "INVALID_EMAIL");
  return s;
}
async function passwordHash(password: unknown) {
  ensure(
    typeof password === "string" &&
      password.length >= 15 &&
      password.length <= 256,
    "PASSWORD_LENGTH",
  );
  const salt = randomBytes(16).toString("hex");
  const key = (await derive(password, salt, 64)) as Buffer;
  return salt + ":" + key.toString("hex");
}
async function passwordMatches(password: unknown, encoded: string) {
  ensure(
    typeof password === "string" && password.length <= 256,
    "UNAUTHORIZED",
  );
  const [salt, key] = encoded.split(":");
  const actual = (await derive(password, salt, 64)) as Buffer;
  return timingSafeEqual(actual, Buffer.from(key, "hex"));
}
/** Conta de acesso não autoriza movimentação de carteira. Nenhuma chave privada é armazenada aqui. */
export class Portal {
  ledger: Ledger;
  now: () => number;
  holidays: string[];
  constructor(
    ledger: Ledger,
    options: { now?: () => number; holidays?: string[] } = {},
  ) {
    this.ledger = ledger;
    this.now = options.now ?? Date.now;
    this.holidays = options.holidays ?? [];
    ensure(
      this.holidays.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)),
      "INVALID_HOLIDAYS",
    );
    ledger.db
      .exec(`CREATE TABLE IF NOT EXISTS portal_accounts(id TEXT PRIMARY KEY,person_id TEXT UNIQUE REFERENCES people(id),name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('member','cadastro','financeiro','atendimento','supervisao')));
   CREATE TABLE IF NOT EXISTS portal_private_data(person_id TEXT PRIMARY KEY REFERENCES people(id),encrypted_identity TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS portal_purchase_requests(id TEXT PRIMARY KEY,person_id TEXT NOT NULL REFERENCES people(id),units INTEGER NOT NULL,custody TEXT NOT NULL,status TEXT NOT NULL,created_at TEXT NOT NULL,order_id TEXT UNIQUE);
   CREATE TABLE IF NOT EXISTS portal_order_consents(order_id TEXT PRIMARY KEY,person_id TEXT NOT NULL REFERENCES people(id),at TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS portal_sessions(hash TEXT PRIMARY KEY,account_id TEXT NOT NULL REFERENCES portal_accounts(id),expires INTEGER NOT NULL);
   CREATE TABLE IF NOT EXISTS applications(person_id TEXT PRIMARY KEY REFERENCES people(id),phone TEXT NOT NULL,units INTEGER NOT NULL,custody TEXT NOT NULL,status TEXT NOT NULL,version INTEGER NOT NULL,submitted_at TEXT NOT NULL,due_date TEXT NOT NULL,pause_at TEXT,message TEXT NOT NULL,checklist TEXT NOT NULL,reason TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS application_history(seq INTEGER PRIMARY KEY,person_id TEXT NOT NULL REFERENCES people(id),actor TEXT NOT NULL REFERENCES portal_accounts(id),at TEXT NOT NULL,status TEXT NOT NULL,message TEXT NOT NULL,reason TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS portal_wallet_proofs(challenge_id TEXT PRIMARY KEY,account_id TEXT NOT NULL REFERENCES portal_accounts(id),person_id TEXT NOT NULL REFERENCES people(id),custody TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS portal_wallet_links(wallet TEXT PRIMARY KEY,person_id TEXT NOT NULL REFERENCES people(id),custody TEXT NOT NULL,actor TEXT NOT NULL,verified_at TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS portal_orders(id TEXT PRIMARY KEY,person_id TEXT NOT NULL REFERENCES people(id),wallet TEXT NOT NULL,units INTEGER NOT NULL,custody TEXT NOT NULL,version INTEGER NOT NULL,status TEXT NOT NULL,created_at TEXT NOT NULL,tx_hash TEXT UNIQUE,details TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS stay_cancellation_requests(stay_id TEXT PRIMARY KEY REFERENCES stays(id),person_id TEXT NOT NULL REFERENCES people(id),requested_at TEXT NOT NULL,reason TEXT NOT NULL,status TEXT NOT NULL,reviewer TEXT,decision_at TEXT,decision_reason TEXT);
  `);
  }
  private encrypt(value: string) {
    const iv = randomBytes(12),
      key = createHash("sha256")
        .update(this.ledger.secret + ":portal-private-v1")
        .digest(),
      cipher = createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([
      cipher.update(value, "utf8"),
      cipher.final(),
    ]);
    return [iv, cipher.getAuthTag(), encrypted]
      .map((b) => b.toString("base64"))
      .join(".");
  }
  private decrypt(value: string) {
    const [iv, tag, data] = value
      .split(".")
      .map((s) => Buffer.from(s, "base64"));
    const key = createHash("sha256")
        .update(this.ledger.secret + ":portal-private-v1")
        .digest(),
      cipher = createDecipheriv("aes-256-gcm", key, iv);
    cipher.setAuthTag(tag);
    return Buffer.concat([cipher.update(data), cipher.final()]).toString(
      "utf8",
    );
  }
  private at() {
    return new Date(this.now()).toISOString();
  }
  requireRole(actor: Account, roles: Role[]) {
    const current = this.account(actor.id);
    ensure(roles.includes(current.role), "FORBIDDEN_ROLE");
    return current;
  }
  account(id: string) {
    const r = this.ledger.db
      .prepare("SELECT * FROM portal_accounts WHERE id=?")
      .get(id) as AccountRow | undefined;
    ensure(r, "UNAUTHORIZED");
    return safeAccount(r);
  }
  application(personId: string) {
    const r = this.ledger.db
      .prepare("SELECT * FROM applications WHERE person_id=?")
      .get(personId) as Application | undefined;
    ensure(r, "APPLICATION_NOT_FOUND");
    return r;
  }
  private record(
    actor: Account,
    personId: string,
    status: string,
    message: string,
    reason: string,
  ) {
    this.ledger.db
      .prepare(
        "INSERT INTO application_history(person_id,actor,at,status,message,reason) VALUES (?,?,?,?,?,?)",
      )
      .run(personId, actor.id, this.at(), status, message, reason);
    this.ledger.audit("application." + status, { actor: actor.id, personId });
  }
  async signup(input: Record<string, unknown>) {
    const name = field(input.name, 150),
      mail = email(input.email),
      phone = field(input.phone, 40),
      identity = cpfKey(field(input.cpf, 30), this.ledger.secret);
    ensure(name.split(/\s+/).length >= 2, "FULL_NAME_REQUIRED");
    ensure(/^[+\d\s()\-]{8,40}$/.test(phone), "INVALID_PHONE");
    ensure(
      Number.isInteger(input.units) &&
        Number(input.units) > 0 &&
        Number(input.units) <= 20,
      "INVALID_UNITS",
    );
    ensure(CUSTODY.includes(input.custody as any), "INVALID_CUSTODY");
    ensure(input.consent === true, "CONSENT_REQUIRED");
    const password = await passwordHash(input.password);
    const actor = this.ledger.transaction(() => {
      ensure(
        !this.ledger.db
          .prepare("SELECT id FROM people WHERE identity_key=?")
          .get(identity) &&
          !this.ledger.db
            .prepare("SELECT id FROM portal_accounts WHERE email=?")
            .get(mail),
        "REGISTRATION_UNAVAILABLE",
      );
      const personId = randomUUID(),
        id = randomUUID();
      this.ledger.db
        .prepare("INSERT INTO people(id,identity_key) VALUES (?,?)")
        .run(personId, identity);
      this.ledger.db
        .prepare("INSERT INTO portal_accounts VALUES (?,?,?,?,?,?)")
        .run(id, personId, name, mail, password, "member");
      this.ledger.db
        .prepare("INSERT INTO applications VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
        .run(
          personId,
          phone,
          Number(input.units),
          String(input.custody),
          "received",
          1,
          this.at(),
          deadline(this.at(), 5, this.holidays),
          null,
          "Recebemos sua candidatura.",
          "{}",
          "",
        );
      this.ledger.db
        .prepare("INSERT INTO portal_private_data VALUES (?,?)")
        .run(personId, this.encrypt(String(input.cpf).replace(/\D/g, "")));
      const actor = this.account(id);
      this.record(
        actor,
        personId,
        "received",
        "Candidatura recebida.",
        "Ciência do modelo acadêmico, teto de 20 e ausência de revenda.",
      );
      return actor;
    });
    return this.profile(actor);
  }
  async createOperator(
    mail: string,
    password: string,
    name: string,
    role: Role,
  ) {
    ensure(
      ["cadastro", "financeiro", "atendimento", "supervisao"].includes(role),
      "INVALID_ROLE",
    );
    const encoded = await passwordHash(password);
    const id = randomUUID();
    this.ledger.db
      .prepare("INSERT INTO portal_accounts VALUES (?,NULL,?,?,?,?)")
      .run(id, field(name, 150), email(mail), encoded, role);
    this.ledger.audit("operator.created", { actor: id, role });
    return this.account(id);
  }
  async login(mail: unknown, password: unknown) {
    const r = this.ledger.db
      .prepare("SELECT * FROM portal_accounts WHERE email=?")
      .get(email(mail)) as AccountRow | undefined;
    // Mesma derivação também para conta inexistente: evita resposta imediata que denuncia cadastro.
    const valid = await passwordMatches(
      password,
      r?.password ?? "00000000000000000000000000000000:" + "00".repeat(64),
    );
    ensure(r && valid, "UNAUTHORIZED");
    const token = randomBytes(32).toString("base64url"),
      seconds = r.role === "member" ? 28800 : 1800;
    this.ledger.db
      .prepare("DELETE FROM portal_sessions WHERE expires<=?")
      .run(this.now());
    this.ledger.db
      .prepare("INSERT INTO portal_sessions VALUES (?,?,?)")
      .run(digest(token), r.id, this.now() + seconds * 1000);
    return { token, seconds, account: safeAccount(r) };
  }
  session(token: string) {
    const r = this.ledger.db
      .prepare(
        "SELECT account_id FROM portal_sessions WHERE hash=? AND expires>?",
      )
      .get(digest(token), this.now()) as { account_id: string } | undefined;
    ensure(r, "UNAUTHORIZED");
    return this.account(r.account_id);
  }
  logout(token: string) {
    this.ledger.db
      .prepare("DELETE FROM portal_sessions WHERE hash=?")
      .run(digest(token));
  }
  private present(personId: string, internal: boolean) {
    const a = this.application(personId);
    const today = dateBR(this.at());
    const done = ["approved", "rejected", "withdrawn"].includes(a.status);
    const state = done
      ? "done"
      : a.pause_at
        ? "paused"
        : today > a.due_date
          ? "overdue"
          : today === a.due_date
            ? "today"
            : "upcoming";
    const businessDays = pausedDays(
      today + "T15:00:00Z",
      a.due_date + "T15:00:00Z",
      this.holidays,
    );
    const label =
      state === "done"
        ? "Análise encerrada"
        : state === "paused"
          ? "Prazo pausado"
          : state === "overdue"
            ? "Prazo vencido"
            : state === "today"
              ? "Vence hoje"
              : `${businessDays} dia${businessDays === 1 ? " útil restante" : "s úteis restantes"}`;
    const history = this.ledger.db
      .prepare(
        `SELECT h.at,h.status,h.message${internal ? ",h.reason,h.actor,a.name AS actorName" : ""} FROM application_history h JOIN portal_accounts a ON a.id=h.actor WHERE h.person_id=? ORDER BY h.seq`,
      )
      .all(personId);
    return {
      personId,
      phone: a.phone,
      units: a.units,
      custody: a.custody,
      status: a.status,
      version: a.version,
      submittedAt: a.submitted_at,
      dueDate: a.due_date,
      deadline: {
        state,
        label,
        businessDays: state === "upcoming" ? businessDays : null,
      },
      pausedAt: a.pause_at,
      message: a.message,
      overdue:
        !["approved", "rejected", "withdrawn"].includes(a.status) &&
        !a.pause_at &&
        dateBR(this.at()) > a.due_date,
      history,
      ...(internal
        ? { checklist: JSON.parse(a.checklist), reason: a.reason }
        : {}),
    };
  }
  profile(actor: Account) {
    this.requireRole(actor, ["member"]);
    ensure(actor.personId, "FORBIDDEN_ROLE");
    return {
      account: this.account(actor.id),
      application: this.present(actor.personId, false),
      purchase: this.purchaseState(actor.personId),
    };
  }
  list(actor: Account) {
    this.requireRole(actor, ["cadastro", "supervisao"]);
    this.ledger.audit("applications.viewed", { actor: actor.id });
    return (
      this.ledger.db
        .prepare(
          "SELECT id FROM portal_accounts WHERE person_id IS NOT NULL ORDER BY rowid DESC",
        )
        .all() as { id: string }[]
    )
      .map((r) => {
        const a = this.account(r.id);
        return { account: a, application: this.present(a.personId!, false) };
      })
      .sort((left, right) => {
        const rank = (status: string) =>
          status === "done" ? 2 : status === "paused" ? 1 : 0;
        return (
          rank(left.application.deadline.state) -
            rank(right.application.deadline.state) ||
          left.application.dueDate.localeCompare(right.application.dueDate) ||
          left.application.submittedAt.localeCompare(
            right.application.submittedAt,
          ) ||
          left.account.id.localeCompare(right.account.id)
        );
      });
  }
  wallets(personId: string) {
    const state = this.ledger.state();
    return this.ledger.wallets(personId).map((wallet) => ({
      ...wallet,
      registeredOnChain: Boolean(
        state?.registeredWallets?.includes(wallet.address),
      ),
    }));
  }
  detail(actor: Account, personId: string) {
    this.requireRole(actor, [
      "cadastro",
      "supervisao",
      "atendimento",
      "financeiro",
    ]);
    const r = this.ledger.db
      .prepare("SELECT id FROM portal_accounts WHERE person_id=?")
      .get(personId) as { id: string } | undefined;
    ensure(r, "APPLICATION_NOT_FOUND");
    if (["financeiro", "atendimento"].includes(actor.role))
      ensure(
        this.application(personId).status === "approved",
        "FORBIDDEN_PERSON",
      );
    this.ledger.audit("application.viewed", { actor: actor.id, personId });
    return {
      account: this.account(r.id),
      application: this.present(
        personId,
        ["cadastro", "supervisao"].includes(actor.role),
      ),
      ...(["cadastro", "supervisao"].includes(actor.role)
        ? { cpf: this.privateIdentity(personId) }
        : {}),
      quota: this.ledger.quota(personId),
      wallets: this.wallets(personId),
      stays: actor.role === "financeiro" ? [] : this.ledger.stays(personId),
      orders: actor.role === "atendimento" ? [] : this.orders(personId),
      cancellations:
        actor.role === "financeiro" ? [] : this.cancellations(personId),
      ...(actor.role === "atendimento"
        ? {}
        : { purchase: this.purchaseState(personId) }),
    };
  }
  private privateIdentity(personId: string) {
    const r = this.ledger.db
      .prepare(
        "SELECT encrypted_identity FROM portal_private_data WHERE person_id=?",
      )
      .get(personId) as { encrypted_identity: string } | undefined;
    return r ? this.decrypt(r.encrypted_identity) : null;
  }
  decide(actor: Account, personId: string, input: Record<string, unknown>) {
    this.requireRole(actor, ["cadastro", "supervisao"]);
    const status = String(input.status);
    ensure(
      ["reviewing", "needs_information", "approved", "rejected"].includes(
        status,
      ),
      "INVALID_STATUS",
    );
    const reason = field(input.reason, 2000),
      message = field(input.message, 1000);
    const checklist =
      input.checklist &&
      typeof input.checklist === "object" &&
      !Array.isArray(input.checklist)
        ? (input.checklist as Record<string, unknown>)
        : {};
    if (status === "approved")
      ensure(
        CHECKLIST.every((k) => checklist[k] === true),
        "CHECKLIST_INCOMPLETE",
      );
    return this.ledger.transaction(() => {
      const a = this.application(personId);
      ensure(a.version === input.version, "VERSION_CONFLICT");
      ensure(
        !["approved", "withdrawn"].includes(a.status),
        "INVALID_TRANSITION",
      );
      // Aprovação não é revogável só no banco: suspensões financeiras requerem fluxo contratual próprio.
      const pause =
        status === "needs_information" ? (a.pause_at ?? this.at()) : null;
      const due =
        a.pause_at && !pause
          ? deadline(
              a.due_date + "T15:00:00Z",
              pausedDays(a.pause_at, this.at(), this.holidays),
              this.holidays,
            )
          : a.due_date;
      this.ledger.db
        .prepare(
          "UPDATE applications SET status=?,version=version+1,message=?,reason=?,checklist=?,pause_at=?,due_date=? WHERE person_id=?",
        )
        .run(
          status,
          message,
          reason,
          JSON.stringify(
            Object.fromEntries(
              CHECKLIST.map((k) => [k, checklist[k] === true]),
            ),
          ),
          pause,
          due,
          personId,
        );
      this.ledger.db
        .prepare("UPDATE people SET verified=? WHERE id=?")
        .run(status === "approved" ? 1 : 0, personId);
      this.record(actor, personId, status, message, reason);
      return this.present(personId, true);
    });
  }
  complement(actor: Account, input: Record<string, unknown>) {
    this.requireRole(actor, ["member"]);
    ensure(actor.personId, "FORBIDDEN_ROLE");
    const note = field(input.note, 2000),
      phone = field(input.phone, 40);
    return this.ledger.transaction(() => {
      const a = this.application(actor.personId!);
      ensure(a.version === input.version, "VERSION_CONFLICT");
      ensure(
        a.status === "needs_information" && a.pause_at,
        "INVALID_TRANSITION",
      );
      const due = deadline(
        a.due_date + "T15:00:00Z",
        pausedDays(a.pause_at, this.at(), this.holidays),
        this.holidays,
      );
      this.ledger.db
        .prepare(
          "UPDATE applications SET phone=?,status='received',pause_at=NULL,due_date=?,version=version+1,message='Complemento recebido.' WHERE person_id=?",
        )
        .run(phone, due, actor.personId!);
      this.record(
        actor,
        actor.personId!,
        "received",
        "Complemento recebido.",
        note,
      );
      return this.profile(actor);
    });
  }
  setInterest(actor: Account, units: unknown, version: unknown) {
    this.requireRole(actor, ["member"]);
    ensure(actor.personId, "FORBIDDEN_ROLE");
    ensure(
      Number.isInteger(units) && Number(units) >= 1 && Number(units) <= 20,
      "INVALID_UNITS",
    );
    return this.ledger.transaction(() => {
      const a = this.application(actor.personId!);
      ensure(a.version === version, "VERSION_CONFLICT");
      ensure(
        !["rejected", "withdrawn"].includes(a.status),
        "INVALID_TRANSITION",
      );
      ensure(
        !this.ledger.db
          .prepare(
            "SELECT id FROM portal_orders WHERE person_id=? AND status IN ('prepared','signing','submitted')",
          )
          .get(actor.personId!),
        "PURCHASE_PENDING",
      );
      ensure(!this.activeRequest(actor.personId!), "PURCHASE_PENDING");
      ensure(
        this.ledger.quota(actor.personId!).balance + Number(units) <= 20,
        "PERSON_CAP",
      );
      this.ledger.db
        .prepare(
          "UPDATE applications SET units=?,version=version+1 WHERE person_id=?",
        )
        .run(Number(units), actor.personId!);
      this.record(
        actor,
        actor.personId!,
        "interest_changed",
        `Interesse atualizado para ${units} IBT. Sem reserva ou cobrança.`,
        "A quantidade final será conferida ao preparar a compra.",
      );
      return this.profile(actor);
    });
  }
  setCustody(actor: Account, custody: unknown, version: unknown) {
    this.requireRole(actor, ["member"]);
    ensure(actor.personId, "FORBIDDEN_ROLE");
    ensure(CUSTODY.includes(custody as any), "INVALID_CUSTODY");
    return this.ledger.transaction(() => {
      const a = this.application(actor.personId!);
      ensure(a.version === version, "VERSION_CONFLICT");
      const q = this.ledger.quota(actor.personId!);
      ensure(
        q.balance === 0 &&
          !this.ledger.db
            .prepare(
              "SELECT id FROM portal_orders WHERE person_id=? AND status IN ('signing','submitted','confirmed')",
            )
            .get(actor.personId!),
        "PURCHASE_ALREADY_SUBMITTED",
      );
      this.ledger.db
        .prepare(
          "UPDATE portal_orders SET status='cancelled' WHERE person_id=? AND status='prepared'",
        )
        .run(actor.personId!);
      this.ledger.db
        .prepare(
          "UPDATE portal_purchase_requests SET status='cancelled' WHERE person_id=? AND status='requested'",
        )
        .run(actor.personId!);
      this.ledger.db
        .prepare(
          "UPDATE applications SET custody=?,version=version+1 WHERE person_id=?",
        )
        .run(String(custody), actor.personId!);
      this.record(
        actor,
        actor.personId!,
        "custody_changed",
        "Preferência de custódia atualizada.",
        String(custody),
      );
      return this.profile(actor);
    });
  }
  activeRequest(personId: string) {
    return this.ledger.db
      .prepare(
        "SELECT * FROM portal_purchase_requests WHERE person_id=? AND status='requested' ORDER BY rowid DESC LIMIT 1",
      )
      .get(personId) as
      | {
          id: string;
          person_id: string;
          units: number;
          custody: string;
          status: string;
          order_id: string | null;
        }
      | undefined;
  }
  requestPurchase(actor: Account, units: unknown, version: unknown) {
    this.requireRole(actor, ["member"]);
    ensure(actor.personId, "FORBIDDEN_ROLE");
    this.approved(actor.personId);
    ensure(
      Number.isInteger(units) && Number(units) > 0 && Number(units) <= 20,
      "INVALID_UNITS",
    );
    return this.ledger.transaction(() => {
      const a = this.application(actor.personId!);
      ensure(a.version === version, "VERSION_CONFLICT");
      ensure(
        !this.activeRequest(actor.personId!) &&
          !this.orders(actor.personId!).some((o) =>
            ["prepared", "signing", "submitted"].includes(String(o.status)),
          ),
        "PURCHASE_PENDING",
      );
      ensure(
        this.ledger.quota(actor.personId!).balance + Number(units) <= 20,
        "PERSON_CAP",
      );
      const id = randomUUID();
      this.ledger.db
        .prepare(
          "INSERT INTO portal_purchase_requests VALUES (?,?,?,?, 'requested',?,NULL)",
        )
        .run(id, actor.personId!, Number(units), a.custody, this.at());
      this.ledger.audit("purchase.requested", {
        actor: actor.id,
        personId: actor.personId,
        request: id,
        units,
        custody: a.custody,
      });
      return this.activeRequest(actor.personId!)!;
    });
  }
  cancelRequest(actor: Account, id: string) {
    this.requireRole(actor, ["member"]);
    ensure(actor.personId, "FORBIDDEN_ROLE");
    const request = this.activeRequest(actor.personId);
    ensure(request?.id === id, "PURCHASE_REQUEST_NOT_FOUND");
    ensure(!request.order_id, "PURCHASE_PENDING");
    this.ledger.db
      .prepare(
        "UPDATE portal_purchase_requests SET status='cancelled' WHERE id=?",
      )
      .run(id);
    this.ledger.audit("purchase.request_cancelled", {
      actor: actor.id,
      request: id,
      personId: actor.personId,
    });
  }
  purchaseState(personId: string) {
    const a = this.application(personId),
      request = this.activeRequest(personId);
    const orders = this.orders(personId),
      pending = orders.find((o) =>
        ["prepared", "signing", "submitted"].includes(String(o.status)),
      );
    const wallets = this.wallets(personId).filter((w) => !w.revoked);
    const requestProof = wallets.find((w) =>
      this.ledger.db
        .prepare(
          "SELECT wallet FROM portal_wallet_links WHERE wallet=? AND custody=?",
        )
        .get(w.address, a.custody),
    );
    const held = this.ledger.quota(personId).balance;
    const stage = pending
      ? pending.status === "prepared"
        ? a.custody === "ibiti" && !pending.consented_at
          ? "consent"
          : "payment"
        : "confirmation"
      : request
        ? !requestProof
          ? "wallet"
          : !requestProof.registeredOnChain
            ? "registration"
            : "preparation"
        : orders.some((o) => o.status === "confirmed")
          ? "completed"
          : "idle";
    return {
      stage,
      request: request ?? null,
      order: pending ?? null,
      wallet: requestProof?.address ?? null,
      units: Number(pending?.units ?? request?.units ?? 0),
      held,
    };
  }
  purchaseQueue(actor: Account) {
    this.requireRole(actor, ["financeiro", "supervisao", "cadastro"]);
    const rows = this.ledger.db
      .prepare(
        "SELECT a.id FROM portal_accounts a JOIN applications p ON p.person_id=a.person_id WHERE p.status='approved' ORDER BY a.rowid",
      )
      .all() as { id: string }[];
    return rows
      .map((r) => {
        const account = this.account(r.id),
          a = this.application(account.personId!);
        return {
          account,
          custody: a.custody,
          purchase: this.purchaseState(account.personId!),
        };
      })
      .filter(
        (r) =>
          r.purchase.stage !== "idle" &&
          (actor.role !== "cadastro" || r.purchase.stage === "registration"),
      );
  }
  stayQueue(actor: Account) {
    this.requireRole(actor, ["atendimento", "supervisao"]);
    return (
      this.ledger.db
        .prepare(
          "SELECT a.id FROM portal_accounts a JOIN applications p ON p.person_id=a.person_id WHERE p.status='approved' ORDER BY a.rowid",
        )
        .all() as { id: string }[]
    ).map((r) => {
      const account = this.account(r.id),
        person = account.personId!;
      return {
        account,
        quota: this.ledger.quota(person),
        stays: this.ledger.stays(person),
        cancellations: this.cancellations(person),
      };
    });
  }
  approved(personId: string) {
    ensure(
      this.application(personId).status === "approved" &&
        this.ledger.person(personId).verified,
      "PERSON_NOT_VERIFIED",
    );
  }
  orders(personId: string) {
    return this.ledger.db
      .prepare(
        "SELECT o.*,c.at AS consented_at FROM portal_orders o LEFT JOIN portal_order_consents c ON c.order_id=o.id WHERE o.person_id=? ORDER BY o.rowid DESC",
      )
      .all(personId);
  }
  cancellations(personId: string) {
    return this.ledger.db
      .prepare(
        "SELECT * FROM stay_cancellation_requests WHERE person_id=? ORDER BY rowid DESC",
      )
      .all(personId);
  }
  requestCancellation(actor: Account, id: string, reason: unknown) {
    this.requireRole(actor, ["member"]);
    ensure(actor.personId, "FORBIDDEN_ROLE");
    const stay = this.ledger.stay(actor.personId, id);
    ensure(
      ["requested", "confirmed"].includes(stay.status),
      "INVALID_TRANSITION",
    );
    const note = field(reason, 2000);
    this.ledger.db
      .prepare(
        "INSERT OR IGNORE INTO stay_cancellation_requests(stay_id,person_id,requested_at,reason,status) VALUES (?,?,?,?,'pending')",
      )
      .run(id, actor.personId, this.at(), note);
    this.ledger.audit("cancellation.requested", {
      actor: actor.id,
      stayId: id,
    });
    return this.cancellations(actor.personId);
  }
  resolveCancellation(
    actor: Account,
    personId: string,
    id: string,
    input: Record<string, unknown>,
  ) {
    this.requireRole(actor, ["atendimento", "supervisao"]);
    const decision = String(input.decision);
    ensure(["return", "retain", "deny"].includes(decision), "INVALID_DECISION");
    const reason = field(input.reason, 2000);
    const c = this.ledger.db
      .prepare(
        "SELECT * FROM stay_cancellation_requests WHERE stay_id=? AND person_id=? AND status='pending'",
      )
      .get(id, personId);
    ensure(c, "CANCELLATION_NOT_PENDING");
    // Decisão + estorno são gravados em uma única transação pelo Ledger.
    return this.ledger.transaction(() => {
      const stay = this.ledger.stay(personId, id);
      ensure(
        ["requested", "confirmed"].includes(stay.status),
        "INVALID_TRANSITION",
      );
      if (decision !== "deny") {
        this.ledger.db
          .prepare("UPDATE stays SET status='cancelled' WHERE id=?")
          .run(id);
        if (decision === "return")
          this.ledger.db
            .prepare(
              "INSERT INTO cancellation_refunds(stay_id,ready_after) VALUES (?,?)",
            )
            .run(id, this.now());
      }
      this.ledger.db
        .prepare(
          "UPDATE stay_cancellation_requests SET status=?,reviewer=?,decision_at=?,decision_reason=? WHERE stay_id=?",
        )
        .run(decision, actor.id, this.at(), reason, id);
      this.ledger.audit("cancellation.decided", {
        actor: actor.id,
        personId,
        stayId: id,
        decision,
        reason,
      });
      return this.ledger.stay(personId, id);
    });
  }
}
