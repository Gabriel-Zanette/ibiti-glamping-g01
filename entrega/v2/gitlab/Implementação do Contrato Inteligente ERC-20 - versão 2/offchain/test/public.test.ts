import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { Ledger } from "../src/ledger.ts";
import { Portal } from "../src/portal.ts";
import { Auth } from "../src/auth.ts";
import { ECONOMIC_REFERENCE } from "../src/economics.ts";
import { createApp } from "../src/api.ts";

test("landing pública inicia jornada; simulação usa preço do memorando, inclusive sem RPC", async () => {
  const ledger = new Ledger(":memory:", "s".repeat(64), "public");
  let online = true;
  const app = createApp({
    ledger,
    portal: new Portal(ledger),
    auth: new Auth(ledger, "http://localhost:3000", 31337),
    origin: "http://localhost:3000",
    chainId: 31337,
    tokenAddress: "0x0000000000000000000000000000000000000001",
    adminToken: "a".repeat(32),
    legacyApi: false,
    chain: {
      sync: async () => {},
      assertCurrent: async () => {},
      royalties: async () => ({}),
    },
    purchases: {
      pricing: async () => {
        if (!online) throw Error("CHAIN_UNAVAILABLE");
        return { unitPrice: "100000000", decimals: 6, symbol: "tBRL" };
      },
      prepare: async () => {
        throw Error("UNUSED");
      },
      verify: async () => "confirmed",
    },
  });
  app.listen(0, "127.0.0.1");
  await once(app, "listening");
  const url = `http://127.0.0.1:${(app.address() as { port: number }).port}`;
  try {
    const response = await fetch(url);
    assert.doesNotMatch(
      response.headers.get("content-security-policy")!,
      /unsafe-inline/,
    );
    const page = await response.text();
    assert.match(page, /Viva o IBITI/);
    assert.match(page, /Simule/);
    assert.match(await (await fetch(url + "/conta")).text(), /id="signup"/);
    assert.equal((await fetch(url + "/simulation")).status, 200);
    assert.deepEqual(
      await (await fetch(url + "/simulation")).json(),
      ECONOMIC_REFERENCE,
    );
    online = false;
    assert.equal((await fetch(url + "/simulation")).status, 200);
    assert.equal((await fetch(url + "/conta")).status, 200);
    assert.equal((await fetch(url + "/assets/../src/server.ts")).status, 404);
  } finally {
    await new Promise<void>((r) => app.close(() => r()));
    ledger.close();
  }
});
