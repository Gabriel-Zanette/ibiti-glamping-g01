import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { FetchRequest, JsonRpcProvider, ZeroAddress } from "ethers";
import { Ledger, ensure } from "./ledger.ts";
import { Portal } from "./portal.ts";
import { ChainSync } from "./chain.ts";
export function runtime() {
  process.umask(0o077);
  const port = Number(process.env.PORT ?? 3000),
    origin = process.env.APP_ORIGIN ?? `http://localhost:${port}`,
    chainId = Number(process.env.CHAIN_ID ?? 11155111);
  const tokenAddress = process.env.TOKEN_ADDRESS ?? ZeroAddress;
  const configured = Boolean(
    process.env.RPC_URL && process.env.TOKEN_ADDRESS && process.env.START_BLOCK,
  );
  ensure(
    configured ||
      ![
        process.env.RPC_URL,
        process.env.TOKEN_ADDRESS,
        process.env.START_BLOCK,
      ].some(Boolean),
    "CHAIN_CONFIG_INCOMPLETE",
  );
  const secret = process.env.IDENTITY_SECRET ?? "";
  const file = resolve(process.env.DATABASE_PATH ?? "data/ibiti.sqlite");
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  const ledger = new Ledger(
    file,
    secret,
    process.env.DATABASE_SCOPE ?? `${chainId}:${tokenAddress.toLowerCase()}`,
  );
  // O escopo estável permite abrir a waitlist antes de configurar a rede; depois do primeiro vínculo a rede não pode ser trocada neste banco.
  if (configured) {
    const binding = `${chainId}:${tokenAddress.toLowerCase()}:${process.env.START_BLOCK}`;
    const old = ledger.meta("portal_chain_binding");
    ensure(!old || old === binding, "DATABASE_CHAIN_MISMATCH");
    ledger.db
      .prepare("INSERT OR IGNORE INTO metadata VALUES (?,?)")
      .run("portal_chain_binding", binding);
  }
  const portal = new Portal(ledger, {
    holidays: (process.env.SERVICE_HOLIDAYS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  });
  let provider: JsonRpcProvider | undefined, chain: ChainSync | undefined;
  if (configured) {
    const rpc = new FetchRequest(process.env.RPC_URL!);
    rpc.timeout = 10_000;
    provider = new JsonRpcProvider(rpc, undefined, { cacheTimeout: -1 });
    chain = new ChainSync(
      ledger,
      provider,
      tokenAddress,
      Number(process.env.START_BLOCK),
      chainId,
    );
  }
  return {
    port,
    origin,
    chainId,
    tokenAddress,
    ledger,
    portal,
    provider,
    chain,
    close() {
      ledger.close();
      provider?.destroy();
    },
  };
}
