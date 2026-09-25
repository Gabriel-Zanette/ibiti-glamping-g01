import { test } from "node:test";
import assert from "node:assert/strict";
import { Ledger } from "../src/ledger.ts";
import { Portal, deadline, CHECKLIST } from "../src/portal.ts";
const input = {
  name: "Ana Oliveira",
  email: "ana@example.test",
  phone: "+55 32 99999-0000",
  cpf: "52998224725",
  password: "Senha longa de exemplo!",
  units: 2,
  custody: "assisted",
  consent: true,
};
const checks = Object.fromEntries(CHECKLIST.map((k) => [k, true]));
test("conta persistente e candidatura isolam identidade, sessões e aprovação", async () => {
  const l = new Ledger(":memory:", "s".repeat(64), "portal");
  const p = new Portal(l);
  try {
    const member = await p.signup(input);
    assert.equal(member.application.status, "received");
    assert.equal(l.person(member.account.personId!).verified, 0);
    await assert.rejects(
      p.signup({ ...input, email: "outro@example.test" }),
      /REGISTRATION_UNAVAILABLE/,
    );
    await assert.rejects(
      p.login(input.email, "senha incorreta"),
      /UNAUTHORIZED/,
    );
    const login = await p.login(input.email, input.password);
    assert.equal(p.session(login.token).id, member.account.id);
    assert.throws(() => p.list(member.account), /FORBIDDEN/);
    const admin = await p.createOperator(
      "cadastro@example.test",
      "Senha do operador longa!",
      "Operador",
      "cadastro",
    );
    assert.throws(
      () =>
        p.decide(admin, member.account.personId!, {
          status: "approved",
          version: 1,
          reason: "Revisado",
          message: "Aprovado",
          checklist: {},
        }),
      /CHECKLIST_INCOMPLETE/,
    );
    p.decide(admin, member.account.personId!, {
      status: "approved",
      version: 1,
      reason: "Identidade revisada",
      message: "Boas-vindas!",
      checklist: checks,
    });
    assert.equal(p.profile(member.account).application.status, "approved");
    assert.equal(l.person(member.account.personId!).verified, 1);
    assert.throws(
      () =>
        p.decide(admin, member.account.personId!, {
          status: "rejected",
          version: 1,
          reason: "Outro",
          message: "Outro",
          checklist: checks,
        }),
      /VERSION_CONFLICT/,
    );
    assert.equal(p.profile(member.account).application.history.length, 2);
    assert.equal(
      JSON.stringify(p.profile(member.account)).includes("Identidade revisada"),
      false,
    );
    p.setCustody(member.account, "ibiti", 2);
    assert.equal(p.profile(member.account).application.custody, "ibiti");
    p.logout(login.token);
    assert.throws(() => p.session(login.token), /UNAUTHORIZED/);
  } finally {
    l.close();
  }
});
test("pessoa legada não pode ser tomada com conhecimento do CPF", async () => {
  const l = new Ledger(":memory:", "s".repeat(64), "portal");
  l.registerPerson(input.cpf);
  const p = new Portal(l);
  try {
    await assert.rejects(p.signup(input), /REGISTRATION_UNAVAILABLE/);
    assert.equal(
      l.db.prepare("SELECT count(*) n FROM portal_accounts").get()!.n,
      0,
    );
  } finally {
    l.close();
  }
});
test("prazo de cinco dias úteis inclui feriados configurados e pausa só pelo tempo pendente", async () => {
  assert.equal(
    deadline("2026-09-25T14:00:00Z", 5, ["2026-09-28"]),
    "2026-10-05",
  );
  const l = new Ledger(":memory:", "s".repeat(64), "portal");
  let now = Date.parse("2026-09-25T14:00:00Z");
  const p = new Portal(l, { now: () => now });
  try {
    const m = await p.signup(input);
    const a = await p.createOperator(
      "review@example.test",
      "Senha de teste longa!",
      "Revisor",
      "cadastro",
    );
    now = Date.parse("2026-09-28T14:00:00Z");
    p.decide(a, m.account.personId!, {
      status: "needs_information",
      version: 1,
      reason: "Contato",
      message: "Confirme telefone",
      checklist: {},
    });
    now = Date.parse("2026-09-30T14:00:00Z");
    p.complement(m.account, {
      phone: input.phone,
      note: "Contato confirmado",
      version: 2,
    });
    assert.equal(p.profile(m.account).application.dueDate, "2026-10-06");
  } finally {
    l.close();
  }
});

test("ficha privada limita CPF ao cadastro/supervisão, sem identificador aberto no banco", async () => {
  const l = new Ledger(":memory:", "s".repeat(64), "private");
  const p = new Portal(l);
  try {
    const member = await p.signup(input);
    const staff = await p.createOperator(
      "review@example.test",
      "Senha grande de operador",
      "Revisor",
      "cadastro",
    );
    const finance = await p.createOperator(
      "finance@example.test",
      "Senha grande do financeiro",
      "Financeiro",
      "financeiro",
    );
    assert.equal(p.detail(staff, member.account.personId!).cpf, input.cpf);
    assert.throws(
      () => p.detail(finance, member.account.personId!),
      /FORBIDDEN_PERSON/,
    );
    p.decide(staff, member.account.personId!, {
      status: "approved",
      version: 1,
      message: "Aprovada",
      reason: "Teste de permissões",
      checklist: Object.fromEntries(CHECKLIST.map((k) => [k, true])),
    });
    assert.equal("cpf" in p.detail(finance, member.account.personId!), false);
    assert.equal(
      JSON.stringify(
        l.db.prepare("SELECT * FROM portal_private_data").all(),
      ).includes(input.cpf),
      false,
    );
  } finally {
    l.close();
  }
});

test("fila prioriza prazo ativo, separa pausadas/concluídas e informa tempo restante", async () => {
  const l = new Ledger(":memory:", "s".repeat(64), "deadline-queue");
  let now = Date.parse("2026-09-25T14:00:00Z");
  const p = new Portal(l, { now: () => now, holidays: ["2026-09-28"] });
  try {
    const a = await p.signup(input);
    const b = await p.signup({
      ...input,
      name: "Bruno Teste",
      email: "b@example.test",
      cpf: "11144477735",
    });
    const c = await p.signup({
      ...input,
      name: "Clara Teste",
      email: "c@example.test",
      cpf: "93541134780",
    });
    const staff = await p.createOperator(
      "staff@example.test",
      "Senha de teste longa!",
      "Revisor",
      "cadastro",
    );
    const aid = a.account.personId!,
      bid = b.account.personId!,
      cid = c.account.personId!;
    l.db
      .prepare("UPDATE applications SET due_date=? WHERE person_id=?")
      .run("2026-09-24", aid);
    l.db
      .prepare("UPDATE applications SET due_date=? WHERE person_id=?")
      .run("2026-09-25", bid);
    let list = p.list(staff);
    assert.deepEqual(
      list.map((r) => r.account.personId),
      [aid, bid, cid],
    );
    assert.equal(list[0].application.deadline.state, "overdue");
    assert.equal(list[1].application.deadline.label, "Vence hoje");
    assert.equal(list[2].application.deadline.businessDays, 5);
    p.decide(staff, aid, {
      status: "approved",
      version: 1,
      message: "Aprovada",
      reason: "Conferido",
      checklist: checks,
    });
    p.decide(staff, bid, {
      status: "needs_information",
      version: 1,
      message: "Contato",
      reason: "Conferir",
      checklist: {},
    });
    list = p.list(staff);
    assert.deepEqual(
      list.map((r) => r.account.personId),
      [cid, bid, aid],
    );
    assert.equal(list[1].application.deadline.state, "paused");
    assert.equal(list[2].application.deadline.state, "done");
    now = Date.parse("2026-10-06T03:00:00Z");
    assert.equal(p.profile(c.account).application.deadline.state, "overdue");
  } finally {
    l.close();
  }
});

test("quantidade de interesse pode mudar após aprovação sem refazer análise nem prazo", async () => {
  const l = new Ledger(":memory:", "s".repeat(64), "intent");
  const p = new Portal(l);
  try {
    const m = await p.signup(input);
    const staff = await p.createOperator(
      "staff@example.test",
      "Senha de teste longa!",
      "Revisor",
      "cadastro",
    );
    const person = m.account.personId!;
    p.decide(staff, person, {
      status: "approved",
      version: 1,
      message: "Aprovada",
      reason: "Conferido",
      checklist: checks,
    });
    const due = p.profile(m.account).application.dueDate;
    const updated = p.setInterest(m.account, 4, 2);
    assert.equal(updated.application.units, 4);
    assert.equal(updated.application.status, "approved");
    assert.equal(updated.application.dueDate, due);
    assert.equal(updated.application.version, 3);
    assert.throws(() => p.setInterest(m.account, 21, 3), /INVALID_UNITS/);
    assert.throws(() => p.setInterest(m.account, 2, 2), /VERSION_CONFLICT/);
    assert.throws(() => p.setInterest(staff, 2, 3), /FORBIDDEN_ROLE/);
    assert.equal(l.quota(person).balance, 0);
  } finally {
    l.close();
  }
});
