import { randomBytes } from "node:crypto";
import { Auth } from "./auth.ts";
import { Purchases } from "./purchase.ts";
import { createApp } from "./api.ts";
import { runtime } from "./runtime.ts";
const r = runtime();
const unavailable = async () => {
  throw Error("CHAIN_NOT_CONFIGURED");
};
const server = createApp({
  ledger: r.ledger,
  portal: r.portal,
  chain: r.chain ?? {
    sync: unavailable,
    assertCurrent: unavailable,
    royalties: unavailable,
  },
  purchases: r.chain ? new Purchases(r.chain) : undefined,
  auth: new Auth(r.ledger, r.origin, r.chainId),
  origin: r.origin,
  chainId: r.chainId,
  tokenAddress: r.tokenAddress,
  adminToken: randomBytes(32).toString("hex"),
  legacyApi: false,
});
server.listen(r.port, "127.0.0.1", () =>
  console.log(
    `Passaporte IBITI: ${r.origin} (ambiente acadêmico; ${r.chain ? "rede " + r.chainId : "waitlist independente de blockchain"})`,
  ),
);
const stop = () =>
  server.close(() => {
    r.close();
    process.exit(0);
  });
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
