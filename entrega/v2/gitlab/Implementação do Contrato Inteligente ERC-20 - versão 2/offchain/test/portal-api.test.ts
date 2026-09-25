import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { Wallet } from "ethers";
import { Ledger } from "../src/ledger.ts";
import { Portal, CHECKLIST } from "../src/portal.ts";
import { Auth } from "../src/auth.ts";
import { createApp } from "../src/api.ts";
test("jornada HTTP: conta sem RPC, revisão individual, assinatura vinculada, cotas e cancelamento manual", async () => {
  const l = new Ledger(":memory:", "s".repeat(64), "httpportal"),
    p = new Portal(l),
    origin = "http://localhost:3000";
  let online = false;
  let beforeAssert: (() => Promise<void>) | undefined;
  const chain = {
    sync: async () => {
      if (!online) throw Error("CHAIN_UNAVAILABLE");
    },
    assertCurrent: async () => {
      if (beforeAssert) await beforeAssert();
      if (!online) throw Error("CHAIN_UNAVAILABLE");
    },
    royalties: async () => ({}),
  };
  const app = createApp({
    ledger: l,
    portal: p,
    auth: new Auth(l, origin, 31337),
    chain,
    origin,
    chainId: 31337,
    tokenAddress: "0x0000000000000000000000000000000000000001",
    adminToken: "x".repeat(32),
    legacyApi: false,
  });
  app.listen(0, "127.0.0.1");
  await once(app, "listening");
  const port = (app.address() as { port: number }).port;
  const call = async (
    path: string,
    body?: unknown,
    cookie = "",
    requestOrigin = origin,
  ) => {
    const r = await fetch(`http://127.0.0.1:${port}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        Origin: requestOrigin,
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return {
      status: r.status,
      data: (await r.json()) as any,
      cookie: r.headers.get("set-cookie")?.split(";")[0] ?? "",
    };
  };
  try {
    const signup = {
      name: "Ana Teste",
      email: "ana@example.test",
      cpf: "52998224725",
      phone: "32999990000",
      password: "Senha bem longa para teste",
      units: 2,
      custody: "direct",
      consent: true,
    };
    assert.equal(
      (await call("/portal/signup", signup, "", "https://evil.test")).status,
      403,
    );
    const registered = await call("/portal/signup", signup);
    assert.equal(registered.status, 201);
    const person = registered.data.account.personId;
    const user = (
      await call("/portal/login", {
        email: signup.email,
        password: signup.password,
      })
    ).cookie;
    assert.ok(user);
    assert.equal((await call("/portal/me", undefined, user)).status, 200);
    assert.equal(
      (await call("/portal/admin/applications", undefined, user)).status,
      403,
    );
    assert.equal(
      (await call("/admin/people", { cpf: signup.cpf }, user)).status,
      401,
    );
    await p.createOperator(
      "operator@example.test",
      "Senha longa de operador",
      "Operador",
      "cadastro",
    );
    const admin = (
      await call("/portal/login", {
        email: "operator@example.test",
        password: "Senha longa de operador",
      })
    ).cookie;
    const decision = await call(
      `/portal/admin/people/${person}/decision`,
      {
        version: 1,
        status: "approved",
        message: "Aprovada",
        reason: "Verificação acadêmica",
        checklist: Object.fromEntries(CHECKLIST.map((k) => [k, true])),
      },
      admin,
    );
    assert.equal(decision.status, 200);
    const wallet = Wallet.createRandom();
    const challenge = (
      await call("/portal/wallet/challenge", { wallet: wallet.address }, user)
    ).data;
    assert.equal(
      (
        await call(
          "/portal/wallet/verify",
          {
            id: challenge.id,
            signature: await wallet.signMessage(challenge.message),
          },
          admin,
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await call(
          "/portal/wallet/verify",
          {
            id: challenge.id,
            signature: await wallet.signMessage(challenge.message),
          },
          user,
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await call(
          `/portal/admin/people/${person}/onchain-registration`,
          { wallet: wallet.address },
          admin,
        )
      ).status,
      200,
    );
    // Apenas o espelho de eventos verificados concede cotas, nunca a aprovação da candidatura.
    assert.equal(
      (await call("/portal/me", undefined, user)).data.quota.balance,
      0,
    );
    const treasury = "0x0000000000000000000000000000000000000001";
    l.applyBlock(
      {
        number: 1,
        hash: "b1",
        timestamp: 1800000000,
        validFrom: 1700000000,
        validUntil: 1900000000,
        paused: false,
        maxPerWallet: 20,
        owner: treasury,
        treasury,
        registeredWallets: [wallet.address.toLowerCase()],
      },
      [
        {
          id: "mint",
          from: "0x0000000000000000000000000000000000000000",
          to: treasury,
          units: 150,
          kind: "emission",
        },
        {
          id: "buy",
          from: treasury,
          to: wallet.address,
          units: 2,
          kind: "transfer",
        },
      ],
    );
    online = true;
    const stay = await call(
      "/portal/stays",
      {
        units: 1,
        arrival: "2027-02-01",
        departure: "2027-02-04",
        idempotencyKey: "one",
      },
      user,
    );
    assert.equal(stay.status, 201);
    assert.equal(
      (await call(`/portal/stays/${stay.data.id}/confirmed`, {}, user)).status,
      403,
    );
    assert.equal(
      (await call(`/portal/stays/${stay.data.id}/completed`, {}, user)).status,
      403,
    );
    assert.equal(
      (
        await call(
          `/portal/stays/${stay.data.id}/cancel`,
          { reason: "Imprevisto familiar" },
          user,
        )
      ).status,
      200,
    );
    assert.equal(l.quota(person).available, 1);
    assert.equal(
      (
        await call(
          `/portal/admin/people/${person}/stays/${stay.data.id}/cancel-decision`,
          { decision: "return", reason: "Autorizado" },
          admin,
        )
      ).status,
      403,
    );
    await p.createOperator(
      "stay@example.test",
      "Senha longa de atendimento",
      "Atendimento",
      "atendimento",
    );
    const attendant = (
      await call("/portal/login", {
        email: "stay@example.test",
        password: "Senha longa de atendimento",
      })
    ).cookie;
    assert.equal(
      (
        await call(
          `/portal/admin/people/${person}/stays/${stay.data.id}/cancel-decision`,
          { decision: "return", reason: "Autorizado conforme análise" },
          attendant,
        )
      ).status,
      200,
    );
    assert.equal(l.quota(person).available, 1);
    l.applyBlock(l.state()!, [], Number.MAX_SAFE_INTEGER);
    assert.equal(l.quota(person).available, 2);
    const next = await call(
      "/portal/stays",
      {
        units: 1,
        arrival: "2027-03-01",
        departure: "2027-03-04",
        idempotencyKey: "race",
      },
      user,
    );
    assert.equal(next.status, 201);
    assert.equal(
      (
        await call(
          `/portal/admin/people/${person}/stays/${next.data.id}/reschedule`,
          { arrival: "2027-03-02", departure: "2027-03-05" },
          admin,
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await call(
          `/portal/admin/people/${person}/stays/${next.data.id}/confirmed`,
          {},
          attendant,
        )
      ).status,
      200,
    );
    let entered!: () => void, release!: () => void;
    const waiting = new Promise<void>((r) => (entered = r)),
      gate = new Promise<void>((r) => (release = r));
    beforeAssert = async () => {
      entered();
      await gate;
    };
    const completion = call(
      `/portal/admin/people/${person}/stays/${next.data.id}/completed`,
      {},
      attendant,
    );
    await waiting;
    await call(
      `/portal/stays/${next.data.id}/cancel`,
      { reason: "Cancelamento durante conciliação" },
      user,
    );
    release();
    assert.equal((await completion).status, 409);
    assert.equal(l.stay(person, next.data.id).status, "confirmed");
    beforeAssert = undefined;
    assert.equal(
      (
        await call(
          `/portal/admin/people/${person}/stays/${stay.data.id}/cancel-decision`,
          { decision: "return", reason: "Duplicado" },
          attendant,
        )
      ).status,
      409,
    );
    assert.equal(
      (await call("/portal/custody", { version: 2, custody: "ibiti" }, user))
        .status,
      409,
    );
    await call("/portal/logout", {}, user);
    assert.equal((await call("/portal/me", undefined, user)).status, 401);
  } finally {
    app.close();
    await once(app, "close");
    l.close();
  }
});
