import { test } from "node:test";
import assert from "node:assert/strict";
import { Ledger } from "../src/ledger.ts";
import { Portal, CHECKLIST } from "../src/portal.ts";
test("financeiro não acessa fila cadastral e compra institucional nasce de solicitação do titular", async () => {
  const l = new Ledger(":memory:", "s".repeat(64), "roles");
  const p = new Portal(l);
  try {
    const m = await p.signup({
      name: "Pessoa Teste",
      email: "test@example.test",
      cpf: "52998224725",
      phone: "32999999999",
      password: "Senha longa para teste",
      units: 3,
      custody: "ibiti",
      consent: true,
    });
    const admin = await p.createOperator(
      "admin@example.test",
      "Senha grande para teste",
      "Cadastro",
      "supervisao",
    );
    const finance = await p.createOperator(
      "finance@example.test",
      "Senha grande para teste",
      "Financeiro",
      "financeiro",
    );
    assert.throws(() => p.list(finance), /FORBIDDEN_ROLE/);
    assert.throws(
      () => p.detail(finance, m.account.personId!),
      /FORBIDDEN_PERSON/,
    );
    assert.throws(
      () => p.requestPurchase(m.account, 3, 1),
      /PERSON_NOT_VERIFIED/,
    );
    p.decide(admin, m.account.personId!, {
      status: "approved",
      version: 1,
      reason: "Teste",
      message: "Aprovado",
      checklist: Object.fromEntries(CHECKLIST.map((k) => [k, true])),
    });
    assert.equal(p.purchaseQueue(finance).length, 0);
    const request = p.requestPurchase(m.account, 2, 2);
    assert.equal(request.units, 2);
    assert.equal(p.purchaseQueue(finance)[0].purchase.stage, "wallet");
    assert.throws(() => p.requestPurchase(m.account, 4, 2), /PURCHASE_PENDING/);
    assert.throws(() => p.requestPurchase(finance, 2, 2), /FORBIDDEN_ROLE/);
    p.cancelRequest(m.account, request.id);
    assert.equal(p.purchaseQueue(finance).length, 0);
    assert.throws(() => p.requestPurchase(m.account, 21, 2), /INVALID_UNITS/);
  } finally {
    l.close();
  }
});
