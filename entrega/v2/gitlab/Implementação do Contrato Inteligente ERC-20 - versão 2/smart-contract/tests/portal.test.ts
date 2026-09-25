import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { localChain } from "../tools/local-chain.ts";
import { Ledger } from "../../offchain/src/ledger.ts";
import { Portal, CHECKLIST } from "../../offchain/src/portal.ts";
import { Auth } from "../../offchain/src/auth.ts";
import { ChainSync } from "../../offchain/src/chain.ts";
import { Purchases } from "../../offchain/src/purchase.ts";
import { createApp } from "../../offchain/src/api.ts";
test("portal integrado à EVM: candidatura → habilitação → pagamento atômico → mesma conta solicita cota", async () => {
  const evm = await localChain();
  const l = new Ledger(":memory:", "s".repeat(64), "portal-evm");
  let app: ReturnType<typeof createApp> | undefined;
  try {
    const [owner, buyer, other] = evm.signers;
    const stable = await evm.deploy("MockStablecoin", ["Teste", "tBRL", 6]);
    const token = await evm.deploy("IBIToken", [
      await owner.getAddress(),
      150,
      1735689600,
      1861919999,
      await stable.getAddress(),
    ]);
    const receipt = await token.deploymentTransaction().wait();
    await (await token.setPrimaryPrice(37055190000n)).wait();
    const p = new Portal(l),
      origin = "http://localhost:3000",
      chain = new ChainSync(
        l,
        evm.provider,
        await token.getAddress(),
        receipt.blockNumber,
        31337,
      ),
      purchases = new Purchases(chain);
    assert.deepEqual(await purchases.pricing(), {
      unitPrice: "37055190000",
      decimals: 6,
      symbol: "tBRL",
    });
    let rpcFailure = false;
    app = createApp({
      ledger: l,
      portal: p,
      chain,
      purchases: {
        prepare: purchases.prepare.bind(purchases),
        verify: async (q, h) => {
          if (rpcFailure) throw Error("CHAIN_UNAVAILABLE");
          return purchases.verify(q, h);
        },
      },
      auth: new Auth(l, origin, 31337),
      origin,
      chainId: 31337,
      tokenAddress: await token.getAddress(),
      adminToken: "s".repeat(32),
      legacyApi: false,
    });
    app.listen(0, "127.0.0.1");
    await once(app, "listening");
    const port = (app.address() as { port: number }).port;
    const call = async (path: string, body?: unknown, cookie = "") => {
      const r = await fetch(`http://127.0.0.1:${port}${path}`, {
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
    };
    const signup = {
      name: "Pessoa Teste",
      email: "person@example.test",
      phone: "32999999999",
      cpf: "52998224725",
      password: "Senha de teste bem longa!",
      units: 2,
      custody: "direct",
      consent: true,
    };
    const me = await call("/portal/signup", signup);
    assert.equal(me.status, 201);
    const person = me.data.account.personId;
    const cookie = (
      await call("/portal/login", {
        email: signup.email,
        password: signup.password,
      })
    ).cookie;
    const operator = await p.createOperator(
      "op@example.test",
      "Senha de operador longa!",
      "Responsável",
      "cadastro",
    );
    p.decide(operator, person, {
      status: "approved",
      version: 1,
      reason: "Teste sintético, sem KYC real",
      message: "Aprovado",
      checklist: Object.fromEntries(CHECKLIST.map((k) => [k, true])),
    });
    const wallet = await buyer.getAddress();
    const c = (await call("/portal/wallet/challenge", { wallet }, cookie)).data;
    assert.equal(
      (
        await call(
          "/portal/wallet/verify",
          { id: c.id, signature: await buyer.signMessage(c.message) },
          cookie,
        )
      ).status,
      200,
    );
    await (await token.registerWallet(wallet, l.personChainId(person))).wait();
    await chain.sync();
    assert.equal(l.quota(person).balance, 0);
    l.db.prepare("UPDATE challenges SET expires=0").run();
    new Auth(l, origin, 31337).challenge(wallet);
    const order = await call(
      "/portal/purchase/prepare",
      { wallet, units: 2 },
      cookie,
    );
    assert.equal(order.status, 201, JSON.stringify(order.data));
    const q = order.data.quote;
    const opCookie = (
      await call("/portal/login", {
        email: "op@example.test",
        password: "Senha de operador longa!",
      })
    ).cookie;
    assert.equal(
      (
        await call(
          `/portal/admin/people/${person}/purchase/${order.data.id}/refresh`,
          { hash: "0x" + "a".repeat(64) },
          opCookie,
        )
      ).status,
      403,
    );
    assert.equal(p.orders(person)[0].status, "prepared");
    assert.equal(
      (await call(`/portal/purchase/${order.data.id}/signing`, {}, cookie))
        .status,
      200,
    );
    assert.equal(
      (
        await call(
          `/portal/purchase/${order.data.id}/abort-signing`,
          { reason: "wallet_rejected" },
          cookie,
        )
      ).status,
      200,
    );
    assert.equal(p.orders(person)[0].status, "prepared");
    assert.equal(
      (await call("/portal/purchase/prepare", { wallet, units: 2 }, cookie))
        .status,
      409,
    );
    await assert.rejects(
      purchases.verify(
        q,
        (await other.sendTransaction({ to: wallet, value: 1n })).hash,
      ),
      /TRANSACTION_MISMATCH/,
    );
    await (await stable.mint(wallet, BigInt(q.amount))).wait();
    await (await buyer.sendTransaction(q.approval)).wait();
    const tx = await buyer.sendTransaction({ to: q.to, data: q.data });
    await tx.wait();
    rpcFailure = true;
    const pending = await call(
      `/portal/purchase/${order.data.id}/submitted`,
      { hash: tx.hash },
      cookie,
    );
    assert.equal(pending.status, 503);
    const stored = p.orders(person)[0];
    assert.equal(stored.status, "submitted");
    assert.equal(stored.tx_hash, tx.hash);
    assert.equal(l.quota(person).balance, 0);
    rpcFailure = false;
    const result = await call(
      `/portal/purchase/${order.data.id}/submitted`,
      { hash: tx.hash },
      cookie,
    );
    assert.equal(result.status, 200, JSON.stringify(result.data));
    assert.equal(result.data.status, "confirmed");
    assert.equal(result.data.quota.available, 2);
    const retry = await call(
      `/portal/purchase/${order.data.id}/refresh`,
      {},
      cookie,
    );
    assert.equal(retry.data.quota.available, 2);
    assert.equal(await token.balanceOf(wallet), 2n);
    assert.equal(
      await stable.balanceOf(await owner.getAddress()),
      BigInt(q.amount),
    );
    await (await stable.mint(wallet, BigInt(q.amount))).wait();
    await (await buyer.sendTransaction(q.approval)).wait();
    await assert.rejects(
      buyer.sendTransaction({ to: q.to, data: q.data }),
      /revert/,
    );
    assert.equal(await token.balanceOf(wallet), 2n);
    const state = l.state()!;
    const arrival = new Date((state.timestamp + 10 * 86400) * 1000)
        .toISOString()
        .slice(0, 10),
      departure = new Date((state.timestamp + 13 * 86400) * 1000)
        .toISOString()
        .slice(0, 10);
    const stay = await call(
      "/portal/stays",
      { units: 1, arrival, departure, idempotencyKey: "e2e-stay" },
      cookie,
    );
    assert.equal(stay.status, 201, JSON.stringify(stay.data));
    assert.equal(stay.data.person_id, person);
    assert.equal(l.quota(person).available, 1);
    // Custódia institucional: membro autoriza o pedido na conta, financeiro assina a carteira dedicada.
    const custodial = await call("/portal/signup", {
      ...signup,
      name: "Cliente Custódia",
      email: "custody@example.test",
      cpf: "11144477735",
      custody: "ibiti",
      units: 1,
    });
    const cp = custodial.data.account.personId;
    const cc = (
      await call("/portal/login", {
        email: "custody@example.test",
        password: signup.password,
      })
    ).cookie;
    p.decide(operator, cp, {
      status: "approved",
      version: 1,
      reason: "Teste de identidade sintética",
      message: "Aprovado",
      checklist: Object.fromEntries(CHECKLIST.map((k) => [k, true])),
    });
    await p.createOperator(
      "finance@example.test",
      "Senha de financeiro longa!",
      "Financeiro",
      "financeiro",
    );
    const fc = (
      await call("/portal/login", {
        email: "finance@example.test",
        password: "Senha de financeiro longa!",
      })
    ).cookie;
    const cw = await other.getAddress(),
      base = "/portal/admin/people/" + cp;
    assert.equal(
      (await call("/portal/wallet/challenge", { wallet: cw }, cc)).status,
      403,
    );
    const challenge = (
      await call(base + "/wallet/challenge", { wallet: cw }, fc)
    ).data;
    assert.equal(
      (
        await call(
          base + "/wallet/verify",
          {
            id: challenge.id,
            signature: await other.signMessage(challenge.message),
          },
          fc,
        )
      ).status,
      200,
    );
    await (await token.registerWallet(cw, l.personChainId(cp))).wait();
    await chain.sync();
    assert.equal(
      (await call("/portal/purchase-request", { units: 1, version: 2 }, cc))
        .status,
      201,
    );
    const abandoned = await call(
      base + "/purchase/prepare",
      { wallet: cw, units: 1 },
      fc,
    );
    assert.equal(
      (await call("/portal/interest", { units: 2, version: 2 }, cc)).status,
      409,
    );
    assert.equal(
      (
        await call(
          "/portal/purchase/" + abandoned.data.id + "/cancel",
          {},
          cookie,
        )
      ).status,
      404,
    );
    assert.equal(
      (await call("/portal/purchase/" + abandoned.data.id + "/cancel", {}, cc))
        .status,
      200,
    );
    assert.equal(p.orders(cp)[0].status, "cancelled");
    assert.equal(
      (await call("/portal/purchase-request", { units: 1, version: 2 }, cc))
        .status,
      201,
    );
    const co = await call(
      base + "/purchase/prepare",
      { wallet: cw, units: 1 },
      fc,
    );
    assert.equal(co.status, 201);
    const cq = co.data.quote;
    assert.equal(
      (await call(base + "/purchase/" + co.data.id + "/signing", {}, fc))
        .status,
      409,
    );
    assert.equal(
      (await call("/portal/purchase/" + co.data.id + "/consent", {}, cc))
        .status,
      200,
    );
    assert.equal(
      (await call(base + "/purchase/" + co.data.id + "/signing", {}, fc))
        .status,
      200,
    );
    assert.equal(
      (await call("/portal/purchase/" + co.data.id + "/cancel", {}, cc)).status,
      409,
    );
    await (await stable.mint(cw, BigInt(cq.amount))).wait();
    await (await other.sendTransaction(cq.approval)).wait();
    const ct = await other.sendTransaction({ to: cq.to, data: cq.data });
    await ct.wait();
    assert.equal(
      (
        await call(
          base + "/purchase/" + co.data.id + "/submitted",
          { hash: ct.hash },
          fc,
        )
      ).data.status,
      "confirmed",
    );
    assert.equal(
      (await call("/portal/purchase/" + co.data.id + "/refresh", {}, cc)).data
        .quota.available,
      1,
    );
    assert.equal(
      (await call("/portal/me", undefined, cc)).data.quota.balance,
      1,
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
