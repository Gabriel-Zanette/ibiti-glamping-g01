/** Reabre somente um ambiente local previamente preservado; não cria emissão nem apaga dados. */
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { JsonRpcProvider, Contract } from "ethers";
import { Ledger, ensure } from "../src/ledger.ts";
import { Portal } from "../src/portal.ts";
import { Auth } from "../src/auth.ts";
import { ChainSync } from "../src/chain.ts";
import { Purchases } from "../src/purchase.ts";
import { createApp } from "../src/api.ts";
import { LocalCustody } from "./local-custody.ts";
import { TOKEN_PRICE_CENTS } from "../src/economics.ts";
process.umask(0o077);
const file = process.argv[2];
ensure(file, "RESUME_FILE_REQUIRED");
const c = JSON.parse(readFileSync(file, "utf8"));
const rpc = new URL(c.rpc);
ensure(["localhost", "127.0.0.1"].includes(rpc.hostname), "LOCAL_DEMO_ONLY");
const provider = new JsonRpcProvider(c.rpc, undefined, { cacheTimeout: -1 });
provider.pollingInterval = 30;
ensure(
  Number((await provider.getNetwork()).chainId) === 31337,
  "LOCAL_DEMO_ONLY",
);
ensure(
  String(await provider.send("web3_clientVersion", []))
    .toLowerCase()
    .includes("anvil"),
  "LOCAL_DEMO_ONLY",
);
const ledger = new Ledger(c.database, c.secret, c.scope),
  portal = new Portal(ledger);
const owner = await provider.getSigner(0);
const token = new Contract(
  c.token,
  [
    "function setPrimaryPrice(uint256)",
    "function primaryUnitPrice() view returns(uint256)",
    "function stablecoin() view returns(address)",
  ],
  owner,
);
const currency = new Contract(
  await token.stablecoin(),
  ["function decimals() view returns(uint8)"],
  provider,
);
ensure(Number(await currency.decimals()) === 6, "DEMO_CURRENCY_DECIMALS");
const price = BigInt(TOKEN_PRICE_CENTS) * 10000n;
// O preço é definido uma única vez no contrato. Nunca contornar essa trava ao retomar.
ensure(
  (await token.primaryUnitPrice()) === price,
  "DEMO_PRICE_REQUIRES_FRESH_INSTANCE",
);
const chain = new ChainSync(ledger, provider, c.token, c.startBlock, 31337);
await chain.sync();
const app = createApp({
  ledger,
  portal,
  chain,
  purchases: new Purchases(chain),
  custody: new LocalCustody(ledger, provider, c.token, owner),
  auth: new Auth(ledger, c.origin, 31337),
  origin: c.origin,
  chainId: 31337,
  tokenAddress: c.token,
  adminToken: randomBytes(32).toString("hex"),
  legacyApi: false,
});
app.listen(Number(new URL(c.origin).port), "127.0.0.1", () =>
  console.log(
    "Portal atualizado em " + c.origin + " — dados e cadeia preservados.",
  ),
);
const stop = () => {
  app.close();
  ledger.close();
  provider.destroy();
  process.exit(0);
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
