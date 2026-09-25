import { createServer } from "node:http";
import { Interface } from "ethers";
import { createHash, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { Ledger, ensure } from "./ledger.ts";
import type { StayStatus } from "./ledger.ts";
import { Auth } from "./auth.ts";
import { Portal } from "./portal.ts";
import { portalRoutes } from "./portal-api.ts";
import type { PurchaseGateway } from "./purchase.ts";
import { ECONOMIC_REFERENCE } from "./economics.ts";
import type { CustodyGateway } from "./custody.ts";
import type { ChainSync } from "./chain.ts";
type Options = {
  custody?: CustodyGateway;
  portal?: Portal;
  purchases?: PurchaseGateway;
  legacyApi?: boolean;
  ledger: Ledger;
  auth: Auth;
  chain:
    | Pick<ChainSync, "sync" | "assertCurrent" | "royalties">
    | {
        sync(): Promise<unknown>;
        assertCurrent(person: string): Promise<unknown>;
        royalties(person: string): Promise<unknown>;
      };
  adminToken: string;
  origin: string;
  chainId: number;
  tokenAddress: string;
};
const digest = (s: string) => createHash("sha256").update(s).digest();
const safeEqual = (a: string, b: string) =>
  timingSafeEqual(digest(a), digest(b));
export function createApp(options: Options) {
  const { ledger, auth, chain, adminToken, origin, chainId, tokenAddress } =
    options;
  const portalHandler = options.portal
    ? portalRoutes({ ...options, portal: options.portal })
    : null;
  ensure(adminToken.length >= 32, "ADMIN_TOKEN_TOO_SHORT");
  const attempts = new Map<string, { count: number; until: number }>();
  let queue: Promise<unknown> = Promise.resolve();
  const serialize = <T>(fn: () => Promise<T>) => {
    const next = queue.then(fn);
    queue = next.catch(() => {});
    return next;
  };
  const text = (v: unknown) => {
    ensure(typeof v === "string" && v.length <= 1024, "INVALID_INPUT");
    return v;
  };
  const app = createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Frame-Options", "DENY");
    // O anotador do navegador Codex injeta <style>, inclusive dentro de shadow DOM.
    // Compatibilidade somente no ensaio local Anvil; scripts e servidor normal continuam restritos.
    const localAnnotations =
      options.custody?.mode === "local-demo" &&
      chainId === 31337 &&
      ["localhost", "127.0.0.1", "[::1]"].includes(new URL(origin).hostname);
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; " +
        (localAnnotations ? "style-src-elem 'self' 'unsafe-inline'; " : "") +
        "connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    );
    const json = (status: number, data: unknown) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify(data));
    };
    try {
      const path = new URL(req.url ?? "/", origin).pathname;
      const method = req.method ?? "GET";
      if (req.headers.origin)
        ensure(req.headers.origin === origin, "FORBIDDEN_ORIGIN");
      const landing = [
        "/",
        "/index.html",
        "/como-funciona.html",
        "/perguntas.html",
        "/transparencia.html",
        "/site.css",
        "/site.js",
        "/landing-motion.js",
        "/assets/territorio-referencia.jpg",
        "/assets/whitepaper-ibiti.md",
      ];
      if (method === "GET" && options.portal && landing.includes(path)) {
        const file = path === "/" ? "index.html" : path.slice(1);
        const body = await readFile(
          new URL("../../guia-de-comunicacao/landing/" + file, import.meta.url),
        );
        const type = file.endsWith(".html")
          ? "text/html"
          : file.endsWith(".js")
            ? "text/javascript"
            : file.endsWith(".css")
              ? "text/css"
              : file.endsWith(".jpg")
                ? "image/jpeg"
                : "text/plain";
        res.writeHead(200, {
          "Content-Type":
            type + (type.startsWith("text/") ? "; charset=utf-8" : ""),
        });
        res.end(body);
        return;
      }
      if (method === "GET" && options.portal && path === "/adquirir.html") {
        res.writeHead(302, { Location: "/conta" });
        res.end();
        return;
      }
      if (
        method === "GET" &&
        [
          "/",
          "/conta",
          "/adquirir.html",
          "/app.js",
          "/style.css",
          "/portal.js",
          "/portal.css",
          "/simulation.js",
        ].includes(path)
      ) {
        const file = ["/", "/conta", "/adquirir.html"].includes(path)
          ? options.portal
            ? "portal.html"
            : "index.html"
          : path.slice(1);
        const body = await readFile(
          new URL("../public/" + file, import.meta.url),
        );
        res.writeHead(200, {
          "Content-Type": file.endsWith(".html")
            ? "text/html; charset=utf-8"
            : file.endsWith(".js")
              ? "text/javascript; charset=utf-8"
              : "text/css; charset=utf-8",
        });
        res.end(body);
        return;
      }
      if (method === "GET" && path === "/config") {
        json(200, {
          chainId,
          tokenAddress,
          mode: "demonstracao-academica",
          localCustody: options.custody?.mode === "local-demo",
          economicReference: ECONOMIC_REFERENCE,
          policy: "unused-first-v1",
        });
        return;
      }
      if (method === "GET" && path === "/health") {
        await chain.sync();
        json(200, { status: "ok", chain: ledger.state() });
        return;
      }
      const ip = req.socket.remoteAddress ?? "unknown";
      const now = Date.now();
      for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
      const rate = attempts.get(ip) ?? { count: 0, until: now + 60_000 };
      rate.count++;
      attempts.set(ip, rate);
      ensure(rate.count <= 120, "RATE_LIMITED");
      if (method === "GET" && path === "/simulation") {
        json(200, ECONOMIC_REFERENCE);
        return;
      }
      const token = String(req.headers.authorization ?? "").replace(
        /^Bearer /,
        "",
      );
      const admin = path.startsWith("/admin/");
      if (admin) ensure(safeEqual(token, adminToken), "UNAUTHORIZED");
      let body: Record<string, unknown> = {};
      if (method === "POST") {
        ensure(
          req.headers["content-type"]?.split(";")[0] === "application/json",
          "INVALID_CONTENT_TYPE",
        );
        let size = 0;
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          size += chunk.length;
          ensure(size <= 16384, "BODY_TOO_LARGE");
          chunks.push(chunk);
        }
        try {
          body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
        } catch {
          throw Error("INVALID_JSON");
        }
        ensure(
          body && typeof body === "object" && !Array.isArray(body),
          "INVALID_INPUT",
        );
      }
      if (path.startsWith("/portal/") && portalHandler) {
        await portalHandler(req, res, path, body);
        return;
      }
      if (options.legacyApi === false) {
        json(404, { error: "NOT_FOUND" });
        return;
      }
      if (method === "POST" && path === "/admin/people") {
        json(201, ledger.registerPerson(text(body.cpf)));
        return;
      }
      const personPath = path.match(/^\/admin\/people\/([^/]+)(.*)$/);
      if (
        personPath &&
        method === "POST" &&
        personPath[2] === "/verification"
      ) {
        ensure(typeof body.verified === "boolean", "INVALID_INPUT");
        ledger.setVerified(personPath[1], body.verified);
        json(200, ledger.person(personPath[1]));
        return;
      }
      if (
        personPath &&
        method === "POST" &&
        personPath[2] === "/onchain-registration"
      ) {
        const wallet = text(body.wallet);
        ensure(
          ledger.requireWallet(wallet) === personPath[1],
          "WALLET_ALREADY_LINKED",
        );
        const personId = ledger.personChainId(personPath[1]);
        const data = new Interface([
          "function registerWallet(address,bytes32)",
        ]).encodeFunctionData("registerWallet", [wallet, personId]);
        json(200, {
          chainId,
          to: tokenAddress,
          wallet,
          personId,
          data,
          status: "AWAITING_ADMIN_SIGNATURE",
        });
        return;
      }
      if (
        personPath &&
        method === "POST" &&
        personPath[2] === "/wallet-challenge"
      ) {
        json(201, auth.challenge(text(body.wallet), personPath[1]));
        return;
      }
      if (path === "/auth/challenge" && method === "POST") {
        json(201, auth.challenge(text(body.wallet)));
        return;
      }
      if (path === "/auth/verify" && method === "POST") {
        json(200, { token: auth.verify(text(body.id), text(body.signature)) });
        return;
      }
      if (path === "/auth/logout" && method === "POST") {
        auth.logout(token);
        json(200, { ok: true });
        return;
      }
      if (!personPath && !path.startsWith("/me")) {
        json(404, { error: "NOT_FOUND" });
        return;
      }
      const personId = personPath
        ? personPath[1]
        : auth.session(token).personId;
      const tail = personPath ? personPath[2] : path.slice(3);
      if (method === "GET" && tail === "") {
        await chain.sync();
        if (!admin) auth.session(token);
        json(200, {
          person: ledger.person(personId),
          quota: ledger.quota(personId),
          stays: ledger.stays(personId),
        });
        return;
      }
      if (method === "GET" && tail === "/royalties") {
        const result = await chain.royalties(personId);
        if (!admin) auth.session(token);
        json(200, result);
        return;
      }
      if (method === "POST" && tail === "/stays") {
        ensure(typeof body.units === "number", "INVALID_UNITS");
        const input = {
          units: body.units,
          arrival: text(body.arrival),
          departure: text(body.departure),
        };
        const key = text(body.idempotencyKey);
        const stay = await serialize(async () => {
          await chain.assertCurrent(personId);
          if (!admin) auth.session(token);
          return ledger.requestStay(personId, input, key);
        });
        json(201, stay);
        return;
      }
      const action = tail.match(
        /^\/stays\/([^/]+)\/(cancelled|confirmed|completed|reschedule)$/,
      );
      if (method === "POST" && action) {
        const [_, id, status] = action;
        if (status === "confirmed" || status === "completed")
          ensure(admin, "FORBIDDEN");
        if (status === "cancelled") {
          json(200, ledger.transition(personId, id, "cancelled"));
          return;
        }
        const result = await serialize(async () => {
          await chain.assertCurrent(personId);
          if (!admin) auth.session(token);
          return status === "reschedule"
            ? ledger.reschedule(
                personId,
                id,
                text(body.arrival),
                text(body.departure),
              )
            : ledger.transition(personId, id, status as StayStatus);
        });
        json(200, result);
        return;
      }
      json(404, { error: "NOT_FOUND" });
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      const known = /^[A-Z][A-Z0-9_]+$/.test(code);
      const status =
        code === "UNAUTHORIZED" ||
        code === "INVALID_SIGNATURE" ||
        code === "CHALLENGE_INVALID"
          ? 401
          : code.startsWith("FORBIDDEN")
            ? 403
            : code.endsWith("NOT_FOUND")
              ? 404
              : code === "RATE_LIMITED"
                ? 429
                : /^(CHAIN_|WRONG_CHAIN|CONTRACT_|INCOMPATIBLE_CONTRACT|LEGACY_|EMISSION_|UNEXPECTED_|AWAITING_FINALITY)/.test(
                      code,
                    )
                  ? 503
                  : /^(VERSION_CONFLICT|PURCHASE_|CANCELLATION_|REGISTRATION_UNAVAILABLE|INVALID_TRANSITION|INSUFFICIENT_|IDEMPOTENCY_|WALLET_ALREADY|PERSON_CAP|NOT_ELIGIBLE|PERSON_NOT_VERIFIED|WALLET_REVOKED)/.test(
                        code,
                      )
                    ? 409
                    : known
                      ? 400
                      : 503;
      // Mensagens de RPC podem conter URL/chave; nunca devolvê-las nem registrar payloads de identidade.
      json(status, { error: known ? code : "SERVICE_UNAVAILABLE" });
    }
  });
  app.requestTimeout = 15_000;
  app.headersTimeout = 10_000;
  return app;
}
