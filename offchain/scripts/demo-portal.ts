/** Ambiente isolado, local e descartável. Somente fundos e identidades sintéticos. */
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomBytes } from "node:crypto";
import { once } from "node:events";
import { id, ZeroAddress } from "ethers";
import { localChain } from "../../smart-contract/tools/local-chain.ts";
import { Ledger } from "../src/ledger.ts";
import { Portal, CHECKLIST } from "../src/portal.ts";
import { ChainSync } from "../src/chain.ts";
import { Purchases } from "../src/purchase.ts";
import { Auth } from "../src/auth.ts";
import { LocalCustody } from "./local-custody.ts";
import { TOKEN_PRICE_CENTS } from "../src/economics.ts";
import { createApp } from "../src/api.ts";

process.umask(0o077);
const port = Number(process.env.DEMO_PORT ?? 3000),
  origin = `http://localhost:${port}`;
const password = "Teste local Ibiti 2026!",
  adminPassword = "Admin local Ibiti 2026!";
const root = resolve(import.meta.dirname, "../../data");
mkdirSync(root, { recursive: true });
const folder = mkdtempSync(resolve(root, "portal-demo-"));
const evm = await localChain();
const [owner, custodian] = evm.signers;
const ledger = new Ledger(
  resolve(folder, "demo.sqlite"),
  randomBytes(32).toString("hex"),
  "demo-only",
);
let app: ReturnType<typeof createApp> | undefined;
try {
  const stable = await evm.deploy("MockStablecoin", [
    "Moeda fictícia de demonstração",
    "tBRL",
    6,
  ]);
  const token = await evm.deploy("IBIToken", [
    owner.address,
    150,
    0,
    0,
    await stable.getAddress(),
  ]);
  const receipt = await token.deploymentTransaction().wait();
  const now = (await evm.provider.getBlock("latest"))!.timestamp;
  await (
    await token.recordOpening(
      now,
      id("ABERTURA SIMULADA LOCAL, NÃO É DATA OFICIAL"),
    )
  ).wait();
  await (
    await token.setPrimaryPrice(BigInt(TOKEN_PRICE_CENTS) * 10000n)
  ).wait(); // referência do memorando, liquidação fictícia local
  const portal = new Portal(ledger),
    chain = new ChainSync(
      ledger,
      evm.provider,
      await token.getAddress(),
      receipt.blockNumber,
      31337,
    );
  const admin = await portal.createOperator(
    "admin@demo.ibiti.test",
    adminPassword,
    "Admin Demonstração",
    "supervisao",
  );
  await portal.createOperator(
    "financeiro@demo.ibiti.test",
    adminPassword,
    "Financeiro Demonstração",
    "financeiro",
  );
  const member = await portal.signup({
    name: "Ana Demonstração",
    email: "participante@demo.ibiti.test",
    phone: "32999990000",
    cpf: "52998224725",
    password,
    units: 3,
    custody: "ibiti",
    consent: true,
  });
  const person = member.account.personId!;
  portal.decide(admin, person, {
    status: "approved",
    version: 1,
    message: "Cadastro de demonstração aprovado.",
    reason: "Dados exclusivamente sintéticos. Não representa KYC real.",
    checklist: Object.fromEntries(CHECKLIST.map((k) => [k, true])),
  });
  for (const [name, email, cpf] of [
    ["Bruno Demonstração", "bruno@demo.ibiti.test", "11144477735"],
    ["Clara Demonstração", "clara@demo.ibiti.test", "93541134780"],
  ])
    await portal.signup({
      name,
      email,
      cpf,
      password,
      phone: "32999990000",
      units: 2,
      custody: "assisted",
      consent: true,
    });
  app = createApp({
    ledger,
    portal,
    chain,
    purchases: new Purchases(chain),
    custody: new LocalCustody(
      ledger,
      evm.provider,
      await token.getAddress(),
      owner,
    ),
    auth: new Auth(ledger, origin, 31337),
    origin,
    chainId: 31337,
    tokenAddress: await token.getAddress(),
    adminToken: randomBytes(32).toString("hex"),
    legacyApi: false,
  });
  app.listen(port, "127.0.0.1");
  await once(app, "listening");
  const call = async (path: string, body: unknown, cookie = "") => {
    const response = await fetch(`${origin}${path}`, {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify(body),
    });
    const data: any = await response.json();
    if (!response.ok) throw Error(`${path}: ${JSON.stringify(data)}`);
    return {
      data,
      cookie: response.headers.get("set-cookie")?.split(";")[0] ?? "",
    };
  };
  const mc = (
    await call("/portal/login", { email: member.account.email, password })
  ).cookie;
  const fc = (
    await call("/portal/login", {
      email: "financeiro@demo.ibiti.test",
      password: adminPassword,
    })
  ).cookie;
  const base = "/portal/admin/people/" + person;
  const challenge = (
    await call(base + "/wallet/challenge", { wallet: custodian.address }, fc)
  ).data;
  await call(
    base + "/wallet/verify",
    {
      id: challenge.id,
      signature: await custodian.signMessage(challenge.message),
    },
    fc,
  );
  await (
    await token.registerWallet(custodian.address, ledger.personChainId(person))
  ).wait();
  await chain.sync();
  await call(
    "/portal/purchase-request",
    { units: 3, version: portal.application(person).version },
    mc,
  );
  const order = (
    await call(
      base + "/purchase/prepare",
      { wallet: custodian.address, units: 3 },
      fc,
    )
  ).data;
  await call(`/portal/purchase/${order.id}/consent`, {}, mc);
  await call(`${base}/purchase/${order.id}/signing`, {}, fc);
  await (
    await stable.mint(custodian.address, BigInt(order.quote.amount))
  ).wait();
  await (await custodian.sendTransaction(order.quote.approval)).wait();
  const purchase = await custodian.sendTransaction({
    to: order.quote.to,
    data: order.quote.data,
  });
  await purchase.wait();
  await call(
    `${base}/purchase/${order.id}/submitted`,
    { hash: purchase.hash },
    fc,
  );
  const quota = ledger.quota(person);
  if (quota.available !== 3)
    throw Error("Cotas da demonstração não foram conciliadas.");
  const assisted = await portal.signup({
    name: "Beatriz Primeira Compra",
    email: "compra@demo.ibiti.test",
    cpf: "12345678909",
    password,
    phone: "32999990000",
    units: 2,
    custody: "ibiti",
    consent: true,
  });
  portal.decide(admin, assisted.account.personId!, {
    status: "approved",
    version: 1,
    message: "Cadastro de teste aprovado. Escolha seus tokens.",
    reason: "Identidade sintética; demonstração do fluxo completo.",
    checklist: Object.fromEntries(CHECKLIST.map((k) => [k, true])),
  });
  const direct = await portal.signup({
    name: "Daniel Carteira Própria",
    email: "direta@demo.ibiti.test",
    cpf: "98765432100",
    password,
    phone: "32999990000",
    units: 1,
    custody: "direct",
    consent: true,
  });
  portal.decide(admin, direct.account.personId!, {
    status: "approved",
    version: 1,
    message: "Cadastro de teste aprovado.",
    reason: "Identidade sintética, carteira própria.",
    checklist: Object.fromEntries(CHECKLIST.map((k) => [k, true])),
  });
  const metadata = {
    origin,
    member: "participante@demo.ibiti.test",
    admin: "admin@demo.ibiti.test",
    finance: "financeiro@demo.ibiti.test",
    rpc: `http://127.0.0.1:${evm.port}`,
    token: await token.getAddress(),
    database: resolve(folder, "demo.sqlite"),
    opening: "SIMULADA",
    units: quota.available,
  };
  writeFileSync(
    resolve(folder, "resume-private.json"),
    JSON.stringify({
      ...metadata,
      secret: ledger.secret,
      scope: "demo-only",
      startBlock: receipt.blockNumber,
    }),
    { mode: 0o600 },
  );
  writeFileSync(
    resolve(folder, "session.json"),
    JSON.stringify(metadata, null, 2),
  );
  console.log(JSON.stringify(metadata, null, 2));
  console.log(
    "Participante: " +
      password +
      "\nAdmin/financeiro: " +
      adminPassword +
      "\nAmbiente descartável; manter este processo aberto. Ctrl+C encerra portal e Anvil.",
  );
  const stop = async () => {
    app?.close();
    ledger.close();
    await evm.stop();
    process.exit(0);
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
} catch (error) {
  app?.close();
  ledger.close();
  await evm.stop();
  throw error;
}
