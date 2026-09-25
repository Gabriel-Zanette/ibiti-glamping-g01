import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { id } from "ethers";
import { localChain } from "../tools/local-chain.ts";
import { Ledger } from "../../offchain/src/ledger.ts";
import { Portal, CHECKLIST } from "../../offchain/src/portal.ts";
import { Auth } from "../../offchain/src/auth.ts";
import { ChainSync } from "../../offchain/src/chain.ts";
import { Purchases } from "../../offchain/src/purchase.ts";
import { createApp } from "../../offchain/src/api.ts";
import { LocalCustody } from "../../offchain/scripts/local-custody.ts";
import { TOKEN_PRICE_CENTS } from "../../offchain/src/economics.ts";

test("custódia local: solicitação, funções separadas, consentimento e compra sem extensão; repetição não duplica", async () => {
  const evm = await localChain(),
    l = new Ledger(":memory:", "s".repeat(64), "custody-flow");
  let app: ReturnType<typeof createApp> | undefined;
  try {
    const [owner] = evm.signers;
    const stable = await evm.deploy("MockStablecoin", ["Teste", "tBRL", 6]);
    const token = await evm.deploy("IBIToken", [
      owner.address,
      150,
      0,
      0,
      await stable.getAddress(),
    ]);
    const receipt = await token.deploymentTransaction().wait();
    await (
      await token.recordOpening(
        (await evm.provider.getBlock("latest"))!.timestamp,
        id("abertura fictícia"),
      )
    ).wait();
    await (
      await token.setPrimaryPrice(BigInt(TOKEN_PRICE_CENTS) * 10000n)
    ).wait();
    const p = new Portal(l),
      origin = "http://localhost:3000",
      chain = new ChainSync(
        l,
        evm.provider,
        await token.getAddress(),
        receipt.blockNumber,
        31337,
      );
    const local = new LocalCustody(
      l,
      evm.provider,
      await token.getAddress(),
      owner,
    );
    let setupHook: undefined | (() => Promise<void>);
    app = createApp({
      ledger: l,
      portal: p,
      auth: new Auth(l, origin, 31337),
      chain,
      purchases: new Purchases(chain),
      custody: {
        mode: "local-demo",
        wallet: local.wallet.bind(local),
        register: local.register.bind(local),
        execute: local.execute.bind(local),
        sign: async (person, message) => {
          if (setupHook) await setupHook();
          return local.sign(person, message);
        },
      },
      origin,
      chainId: 31337,
      tokenAddress: await token.getAddress(),
      adminToken: "a".repeat(32),
      legacyApi: false,
    });
    app.listen(0, "127.0.0.1");
    await once(app, "listening");
    const url = `http://127.0.0.1:${(app.address() as { port: number }).port}`;
    async function call(path: string, body?: unknown, cookie = "") {
      const r = await fetch(url + path, {
        method: body === undefined ? "GET" : "POST",
        headers: {
          Origin: origin,
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
    }
    const policy = (await fetch(url)).headers.get("content-security-policy")!;
    assert.match(policy, /style-src-elem 'self' 'unsafe-inline'/);
    assert.match(policy, /script-src 'self';/);
    const password = "Senha de teste suficientemente longa";
    const admin = await p.createOperator(
      "admin@example.test",
      password,
      "Cadastro Teste",
      "cadastro",
    );
    await p.createOperator(
      "finance@example.test",
      password,
      "Financeiro Teste",
      "financeiro",
    );
    const ac = (await call("/portal/login", { email: admin.email, password }))
      .cookie;
    const fc = (
      await call("/portal/login", { email: "finance@example.test", password })
    ).cookie;
    const member = await p.signup({
      name: "Pessoa Sintética",
      email: "user@example.test",
      cpf: "52998224725",
      phone: "32999990000",
      password,
      units: 2,
      custody: "ibiti",
      consent: true,
    });
    const person = member.account.personId!,
      base = "/portal/admin/people/" + person;
    const mc = (
      await call("/portal/login", { email: member.account.email, password })
    ).cookie;
    assert.equal(
      (await call("/portal/admin/applications", undefined, fc)).status,
      403,
    );
    assert.equal(
      (await call("/portal/admin/stays", undefined, fc)).status,
      403,
    );
    assert.equal((await call(base, undefined, fc)).status, 403);
    assert.equal(
      (await call(base + "/decision", { status: "approved", version: 1 }, fc))
        .status,
      403,
    );
    assert.equal(
      (await call("/portal/purchase-request", { units: 2, version: 1 }, mc))
        .status,
      409,
    );
    p.decide(admin, person, {
      status: "approved",
      version: 1,
      message: "Aprovado",
      reason: "Teste",
      checklist: Object.fromEntries(CHECKLIST.map((k) => [k, true])),
    });
    assert.equal(
      (await call(base + "/custody/prepare-wallet", {}, fc)).status,
      409,
    );
    assert.equal(
      (await call("/portal/purchase-request", { units: 2, version: 2 }, mc))
        .status,
      201,
    );
    assert.equal(
      (await call("/portal/admin/purchases", undefined, fc)).data[0].purchase
        .stage,
      "wallet",
    );
    assert.equal(
      (await call(base + "/custody/prepare-wallet", {}, ac)).status,
      403,
    );
    // Cancelamento durante a assinatura impede vincular uma carteira a uma solicitação retirada.
    setupHook = async () =>
      p.cancelRequest(member.account, p.activeRequest(person)!.id);
    assert.equal(
      (await call(base + "/custody/prepare-wallet", {}, fc)).status,
      409,
    );
    assert.equal(p.wallets(person).length, 0);
    setupHook = undefined;
    await call("/portal/purchase-request", { units: 2, version: 2 }, mc);
    assert.equal(
      (await call(base + "/custody/prepare-wallet", {}, fc)).status,
      200,
    );
    const wallet = p.purchaseState(person).wallet;
    assert.ok(wallet);
    assert.equal(
      (
        await call(
          base + "/onchain-registration",
          { wallet, executeLocal: true },
          fc,
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await call(
          base + "/onchain-registration",
          { wallet, executeLocal: true },
          ac,
        )
      ).status,
      200,
    );
    assert.equal(
      (await call(base + "/purchase/prepare", { wallet, units: 2 }, ac)).status,
      403,
    );
    const order = await call(
      base + "/purchase/prepare",
      { wallet, units: 2 },
      fc,
    );
    assert.equal(order.status, 201);
    assert.equal(
      order.data.quote.amount,
      String(BigInt(TOKEN_PRICE_CENTS) * 20000n),
    );
    const execute = base + "/purchase/" + order.data.id + "/execute";
    assert.equal(
      (await call(execute, {}, fc)).data.error,
      "PURCHASE_CONSENT_REQUIRED",
    );
    assert.equal(l.quota(person).balance, 0);
    assert.equal(
      (await call(base + "/purchase/" + order.data.id + "/consent", {}, fc))
        .status,
      403,
    );
    assert.equal(
      (await call("/portal/purchase/" + order.data.id + "/consent", {}, mc))
        .status,
      200,
    );
    assert.equal(
      (await call("/portal/purchase/" + order.data.id + "/execute", {}, mc))
        .status,
      403,
    );
    const bought = await call(execute, {}, fc);
    assert.equal(bought.status, 200, JSON.stringify(bought.data));
    assert.equal(bought.data.status, "confirmed");
    assert.equal(l.quota(person).available, 2);
    assert.equal(p.purchaseState(person).stage, "completed");
    assert.equal(await token.balanceOf(wallet), 2n);
    assert.equal((await call(execute, {}, fc)).status, 409);
    assert.equal(await token.balanceOf(wallet), 2n);
    const profile = await call("/portal/me", undefined, mc);
    assert.equal(profile.data.quota.available, 2);
    assert.equal(
      (await call("/portal/admin/purchases", undefined, mc)).status,
      403,
    );
  } finally {
    if (app) {
      app.close();
      await once(app, "close");
    }
    l.close();
    await evm.stop();
  }
});
