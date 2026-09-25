import type { IncomingMessage, ServerResponse } from "node:http";
import { Interface, randomBytes, hexlify } from "ethers";
import { Portal, field } from "./portal.ts";
import { ensure, address } from "./ledger.ts";
import type { Auth } from "./auth.ts";
import type { CustodyGateway } from "./custody.ts";
import type { PurchaseGateway, Quote } from "./purchase.ts";
type Options = {
  portal: Portal;
  auth: Auth;
  origin: string;
  chainId: number;
  tokenAddress: string;
  chain: {
    sync(): Promise<unknown>;
    assertCurrent(person: string): Promise<unknown>;
    royalties(person: string): Promise<unknown>;
  };
  purchases?: PurchaseGateway;
  custody?: CustodyGateway;
};
export function portalRoutes(options: Options) {
  const {
    portal: p,
    auth,
    origin,
    chainId,
    tokenAddress,
    chain,
    purchases,
    custody,
  } = options;
  const l = p.ledger;
  let queue: Promise<unknown> = Promise.resolve();
  const serial = <T>(fn: () => Promise<T>) => {
    const result = queue.then(fn);
    queue = result.catch(() => {});
    return result;
  };
  const attempts = new Map<string, { count: number; until: number }>();
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    path: string,
    body: Record<string, unknown>,
  ) => {
    const method = req.method ?? "GET";
    const json = (status: number, data: unknown) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify(data));
    };
    if (method === "POST")
      ensure(req.headers.origin === origin, "FORBIDDEN_ORIGIN");
    const cookie =
      String(req.headers.cookie ?? "")
        .split(";")
        .map((x) => x.trim())
        .find((x) => x.startsWith("ibiti_session="))
        ?.slice(14) ?? "";
    const session = () => p.session(cookie);
    if (
      method === "POST" &&
      ["/portal/signup", "/portal/login"].includes(path)
    ) {
      const now = Date.now(),
        key = req.socket.remoteAddress ?? "unknown";
      for (const [k, v] of attempts) if (v.until <= now) attempts.delete(k);
      const n = attempts.get(key) ?? { count: 0, until: now + 900000 };
      attempts.set(key, n);
      ensure(++n.count <= 20, "RATE_LIMITED");
      if (path.endsWith("signup")) {
        json(201, await p.signup(body));
        return;
      }
      const login = await p.login(body.email, body.password);
      res.setHeader(
        "Set-Cookie",
        `ibiti_session=${login.token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${login.seconds}${origin.startsWith("https:") ? "; Secure" : ""}`,
      );
      json(200, { account: login.account });
      return;
    }
    const actor = session();
    if (method === "POST" && path === "/portal/logout") {
      p.logout(cookie);
      res.setHeader(
        "Set-Cookie",
        "ibiti_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
      );
      json(200, { ok: true });
      return;
    }
    if (method === "GET" && path === "/portal/me") {
      json(
        200,
        actor.role === "member"
          ? {
              ...p.profile(actor),
              quota: l.quota(actor.personId!),
              wallets: p.wallets(actor.personId!),
              stays: l.stays(actor.personId!),
              orders: p.orders(actor.personId!),
              cancellations: p.cancellations(actor.personId!),
            }
          : { account: actor },
      );
      return;
    }
    if (method === "POST" && path === "/portal/purchase-request") {
      json(201, p.requestPurchase(actor, body.units, body.version));
      return;
    }
    if (method === "POST" && path === "/portal/purchase-request/cancel") {
      p.cancelRequest(actor, field(body.id));
      json(200, { ok: true });
      return;
    }
    if (method === "GET" && path === "/portal/admin/purchases") {
      json(200, p.purchaseQueue(actor));
      return;
    }
    if (method === "GET" && path === "/portal/admin/stays") {
      json(200, p.stayQueue(actor));
      return;
    }
    if (method === "POST" && path === "/portal/interest") {
      json(200, p.setInterest(actor, body.units, body.version));
      return;
    }
    if (method === "POST" && path === "/portal/custody") {
      json(200, p.setCustody(actor, body.custody, body.version));
      return;
    }
    if (method === "POST" && path === "/portal/complement") {
      json(200, p.complement(actor, body));
      return;
    }
    if (method === "GET" && path === "/portal/admin/applications") {
      json(200, p.list(actor));
      return;
    }
    const admin = path.match(/^\/portal\/admin\/people\/([^/]+)(.*)$/);
    if (admin)
      p.requireRole(actor, [
        "cadastro",
        "financeiro",
        "atendimento",
        "supervisao",
      ]);
    const personId = admin ? admin[1] : actor.personId;
    if (admin && method === "GET" && admin[2] === "") {
      json(200, p.detail(actor, personId!));
      return;
    }
    if (admin && method === "POST" && admin[2] === "/decision") {
      json(200, p.decide(actor, personId!, body));
      return;
    }
    ensure(personId, "FORBIDDEN_ROLE");
    const tail = admin ? admin[2] : path.slice("/portal".length);
    if (
      admin &&
      (tail.startsWith("/purchase/") || tail.startsWith("/custody/"))
    )
      p.requireRole(actor, ["financeiro", "supervisao"]);
    if (method === "POST" && tail === "/custody/prepare-wallet") {
      p.requireRole(actor, ["financeiro"]);
      p.approved(personId);
      ensure(
        admin && custody?.mode === "local-demo" && chainId === 31337,
        "CUSTODY_PROVIDER_UNAVAILABLE",
      );
      const application = p.application(personId),
        request = p.activeRequest(personId);
      ensure(
        application.custody === "ibiti" && request,
        "PURCHASE_REQUEST_REQUIRED",
      );
      await serial(async () => {
        session();
        const wallet = address(await custody.wallet(personId));
        const challenge = auth.challenge(wallet, personId);
        const signature = await custody.sign(personId, challenge.message);
        session();
        p.approved(personId);
        ensure(
          p.application(personId).version === application.version &&
            p.activeRequest(personId)?.id === request.id,
          "VERSION_CONFLICT",
        );
        const signed = auth.verify(challenge.id, signature);
        auth.logout(signed);
        l.db
          .prepare(
            "INSERT INTO portal_wallet_links VALUES (?,?,?,?,?) ON CONFLICT(wallet) DO UPDATE SET custody=excluded.custody,actor=excluded.actor,verified_at=excluded.verified_at",
          )
          .run(wallet, personId, "ibiti", actor.id, new Date().toISOString());
        l.audit("custody.demo_wallet_prepared", {
          actor: actor.id,
          personId,
          wallet,
        });
      });
      json(200, { purchase: p.purchaseState(personId) });
      return;
    }
    if (method === "POST" && tail === "/sync") {
      await chain.sync();
      session();
      json(200, {
        quota: l.quota(personId),
        wallets: p.wallets(personId),
        stays: l.stays(personId),
      });
      return;
    }
    if (method === "GET" && tail === "/royalties") {
      if (admin) p.requireRole(actor, ["financeiro", "supervisao"]);
      const result = await chain.royalties(personId);
      session();
      json(200, result);
      return;
    }
    if (method === "POST" && tail === "/onchain-registration") {
      p.requireRole(actor, ["cadastro", "supervisao"]);
      p.approved(personId);
      const wallet = address(field(body.wallet));
      ensure(l.requireWallet(wallet) === personId, "FORBIDDEN_WALLET");
      if (body.executeLocal === true) {
        ensure(
          custody?.mode === "local-demo" && chainId === 31337,
          "CUSTODY_PROVIDER_UNAVAILABLE",
        );
        const hash = await custody.register(wallet, l.personChainId(personId));
        await chain.sync();
        session();
        l.audit("custody.demo_wallet_registered", {
          actor: actor.id,
          personId,
          wallet,
          hash,
        });
        json(200, { hash, purchase: p.purchaseState(personId) });
        return;
      }
      json(200, {
        chainId,
        to: tokenAddress,
        data: new Interface([
          "function registerWallet(address,bytes32)",
        ]).encodeFunctionData("registerWallet", [
          wallet,
          l.personChainId(personId),
        ]),
        status: "AWAITING_SIGNATURE",
      });
      return;
    }
    const authorizeWallet = () => {
      p.approved(personId);
      const a = p.application(personId);
      if (a.custody === "ibiti") {
        ensure(Boolean(admin), "FORBIDDEN_CUSTODY");
        p.requireRole(actor, ["financeiro"]);
      } else {
        ensure(!admin && actor.role === "member", "FORBIDDEN_CUSTODY");
      }
      return a;
    };
    if (method === "POST" && tail === "/wallet/challenge") {
      const a = authorizeWallet(),
        wallet = address(field(body.wallet));
      ensure(
        wallet !== (l.state()?.treasury ?? "").toLowerCase(),
        "FORBIDDEN_TREASURY",
      );
      const c = auth.challenge(wallet, personId);
      l.db
        .prepare("INSERT INTO portal_wallet_proofs VALUES (?,?,?,?)")
        .run(c.id, actor.id, personId, a.custody);
      json(201, c);
      return;
    }
    if (method === "POST" && tail === "/wallet/verify") {
      const a = authorizeWallet(),
        proof = l.db
          .prepare("SELECT * FROM portal_wallet_proofs WHERE challenge_id=?")
          .get(field(body.id)) as
          | { account_id: string; person_id: string; custody: string }
          | undefined;
      ensure(
        proof &&
          proof.account_id === actor.id &&
          proof.person_id === personId &&
          proof.custody === a.custody,
        "CHALLENGE_INVALID",
      );
      const token = auth.verify(field(body.id), field(body.signature));
      const signed = auth.session(token);
      auth.logout(token);
      l.db
        .prepare(
          "INSERT INTO portal_wallet_links VALUES (?,?,?,?,?) ON CONFLICT(wallet) DO UPDATE SET custody=excluded.custody,actor=excluded.actor,verified_at=excluded.verified_at",
        )
        .run(
          signed.wallet,
          personId,
          a.custody,
          actor.id,
          new Date().toISOString(),
        );
      l.audit("portal.wallet_linked", {
        actor: actor.id,
        personId,
        custody: a.custody,
      });
      json(200, { wallets: l.wallets(personId) });
      return;
    }
    if (method === "POST" && tail === "/purchase/prepare") {
      ensure(purchases, "CHAIN_NOT_CONFIGURED");
      const a = authorizeWallet();
      const wallet = address(field(body.wallet));
      const requested = p.activeRequest(personId);
      if (a.custody === "ibiti")
        ensure(
          requested &&
            requested.units === body.units &&
            requested.custody === a.custody,
          "PURCHASE_REQUEST_REQUIRED",
        );
      ensure(l.requireWallet(wallet) === personId, "FORBIDDEN_WALLET");
      const proof = l.db
        .prepare(
          "SELECT wallet FROM portal_wallet_links WHERE person_id=? AND custody=? AND wallet=?",
        )
        .get(personId, a.custody, wallet);
      ensure(proof, "WALLET_PROOF_REQUIRED");
      const result = await serial(async () => {
        session();
        ensure(
          !l.db
            .prepare(
              "SELECT id FROM portal_orders WHERE person_id=? AND status IN ('prepared','signing','submitted')",
            )
            .get(personId),
          "PURCHASE_PENDING",
        );
        const order = hexlify(randomBytes(32));
        const quote = await purchases.prepare(
          personId,
          wallet,
          Number(body.units),
          order,
        );
        session();
        ensure(
          p.application(personId).version === a.version,
          "VERSION_CONFLICT",
        );
        p.approved(personId);
        if (requested)
          ensure(
            p.activeRequest(personId)?.id === requested.id,
            "PURCHASE_REQUEST_NOT_FOUND",
          );
        l.db
          .prepare(
            "INSERT INTO portal_orders VALUES (?,?,?,?,?,?,'prepared',?,NULL,?)",
          )
          .run(
            order,
            personId,
            wallet,
            Number(body.units),
            a.custody,
            a.version,
            new Date().toISOString(),
            JSON.stringify(quote),
          );
        if (requested)
          l.db
            .prepare(
              "UPDATE portal_purchase_requests SET order_id=? WHERE id=? AND status='requested'",
            )
            .run(order, requested.id);
        l.audit("purchase.prepared", { actor: actor.id, personId, order });
        return { id: order, quote };
      });
      json(201, result);
      return;
    }
    const orderPath = tail.match(
      /^\/purchase\/([^/]+)\/(submitted|refresh|cancel|signing|consent|abort-signing|execute)$/,
    );
    if (method === "POST" && orderPath) {
      await serial(async () => {
        ensure(purchases, "CHAIN_NOT_CONFIGURED");
        // O titular pode desfazer seu pedido ainda preparado mesmo sob custódia IBITI.
        // Isso não assina, cancela ou estorna uma transação na rede.
        const memberCancellation =
          orderPath[2] === "cancel" && !admin && actor.role === "member";
        if (
          !["consent", "refresh"].includes(orderPath[2]) &&
          !memberCancellation
        )
          authorizeWallet();
        const order = l.db
          .prepare("SELECT * FROM portal_orders WHERE id=? AND person_id=?")
          .get(orderPath[1], personId) as
          | {
              id: string;
              status: string;
              details: string;
              tx_hash: string | null;
            }
          | undefined;
        ensure(order, "ORDER_NOT_FOUND");
        if (orderPath[2] === "execute") {
          ensure(
            admin && custody?.mode === "local-demo" && chainId === 31337,
            "CUSTODY_PROVIDER_UNAVAILABLE",
          );
          p.requireRole(actor, ["financeiro"]);
          ensure(
            p.application(personId).custody === "ibiti",
            "FORBIDDEN_CUSTODY",
          );
          ensure(order.status === "prepared", "PURCHASE_ALREADY_SUBMITTED");
          ensure(
            l.db
              .prepare(
                "SELECT order_id FROM portal_order_consents WHERE order_id=? AND person_id=?",
              )
              .get(order.id, personId),
            "PURCHASE_CONSENT_REQUIRED",
          );
          l.db
            .prepare("UPDATE portal_orders SET status='signing' WHERE id=?")
            .run(order.id);
          l.audit("custody.demo_payment_started", {
            actor: actor.id,
            personId,
            order: order.id,
          });
          const quote = JSON.parse(order.details) as Quote;
          const hash = await custody.execute(personId, quote, (hash) => {
            l.db
              .prepare(
                "UPDATE portal_orders SET tx_hash=?,status='submitted' WHERE id=?",
              )
              .run(hash, order.id);
            l.audit("purchase.transaction_received", {
              actor: actor.id,
              personId,
              order: order.id,
              hash,
            });
          });
          const status = await purchases.verify(quote, hash);
          l.db
            .prepare("UPDATE portal_orders SET status=? WHERE id=?")
            .run(status, order.id);
          if (status === "confirmed")
            l.db
              .prepare(
                "UPDATE portal_purchase_requests SET status='completed' WHERE order_id=?",
              )
              .run(order.id);
          json(200, { status, quota: l.quota(personId) });
          return;
        }
        if (orderPath[2] === "consent") {
          ensure(
            !admin &&
              p.application(personId).custody === "ibiti" &&
              order.status === "prepared",
            "FORBIDDEN_CUSTODY",
          );
          p.approved(personId);
          l.db
            .prepare(
              "INSERT OR IGNORE INTO portal_order_consents VALUES (?,?,?)",
            )
            .run(order.id, personId, new Date().toISOString());
          l.audit("purchase.consented", {
            actor: actor.id,
            personId,
            order: order.id,
          });
          json(200, { ok: true });
          return;
        }
        if (orderPath[2] === "signing") {
          if (p.application(personId).custody === "ibiti")
            ensure(
              l.db
                .prepare(
                  "SELECT order_id FROM portal_order_consents WHERE order_id=? AND person_id=?",
                )
                .get(order.id, personId),
              "PURCHASE_CONSENT_REQUIRED",
            );
          ensure(
            ["prepared", "signing"].includes(order.status),
            "PURCHASE_ALREADY_SUBMITTED",
          );
          l.db
            .prepare("UPDATE portal_orders SET status='signing' WHERE id=?")
            .run(order.id);
          json(200, { status: "signing" });
          return;
        }
        if (orderPath[2] === "abort-signing") {
          ensure(
            order.status === "signing" &&
              !order.tx_hash &&
              body.reason === "wallet_rejected",
            "PURCHASE_ALREADY_SUBMITTED",
          );
          l.db
            .prepare("UPDATE portal_orders SET status='prepared' WHERE id=?")
            .run(order.id);
          l.audit("purchase.signature_rejected", {
            actor: actor.id,
            personId,
            order: order.id,
          });
          json(200, { status: "prepared" });
          return;
        }
        if (orderPath[2] === "cancel") {
          ensure(order.status === "prepared", "PURCHASE_ALREADY_SUBMITTED");
          l.db
            .prepare("UPDATE portal_orders SET status='cancelled' WHERE id=?")
            .run(order.id);
          l.db
            .prepare(
              "UPDATE portal_purchase_requests SET status='cancelled' WHERE order_id=?",
            )
            .run(order.id);
          l.audit("purchase.preparation_cancelled", {
            actor: actor.id,
            personId,
            order: order.id,
          });
          json(200, { status: "cancelled" });
          return;
        }
        if (p.application(personId).custody === "ibiti")
          ensure(
            l.db
              .prepare(
                "SELECT order_id FROM portal_order_consents WHERE order_id=? AND person_id=?",
              )
              .get(order.id, personId),
            "PURCHASE_CONSENT_REQUIRED",
          );
        if (orderPath[2] === "refresh") {
          ensure(body.hash === undefined, "FORBIDDEN_TRANSACTION_CHANGE");
          ensure(order.tx_hash, "TRANSACTION_NOT_RECORDED");
        }
        ensure(
          ["prepared", "signing", "submitted", "confirmed", "failed"].includes(
            order.status,
          ),
          "INVALID_TRANSITION",
        );
        const hash = body.hash
          ? field(body.hash)
          : (order.tx_hash ?? field(body.hash));
        ensure(/^0x[0-9a-fA-F]{64}$/.test(hash), "INVALID_TRANSACTION");
        if (order.status === "confirmed" && body.hash)
          ensure(body.hash === order.tx_hash, "TRANSACTION_MISMATCH");
        l.audit("purchase.transaction_received", {
          actor: actor.id,
          personId,
          order: order.id,
          hash,
        });
        // Persistir antes da consulta: uma falha RPC nunca reabre o botão de pagar.
        l.db
          .prepare(
            "UPDATE portal_orders SET tx_hash=?,status='submitted' WHERE id=? AND status!='confirmed'",
          )
          .run(hash, order.id);
        const status = await purchases.verify(
          JSON.parse(order.details) as Quote,
          hash,
        );
        session();
        l.db
          .prepare("UPDATE portal_orders SET tx_hash=?,status=? WHERE id=?")
          .run(hash, status, order.id);
        if (status === "confirmed")
          l.db
            .prepare(
              "UPDATE portal_purchase_requests SET status='completed' WHERE order_id=?",
            )
            .run(order.id);
        json(200, { status, quota: l.quota(personId) });
        return;
      });
      return;
    }
    if (method === "POST" && tail === "/stays") {
      ensure(!admin, "FORBIDDEN_ROLE");
      p.approved(personId);
      const input = {
        units: Number(body.units),
        arrival: field(body.arrival),
        departure: field(body.departure),
      };
      ensure(
        Date.parse(input.departure) - Date.parse(input.arrival) ===
          3 * 86400000,
        "EXPERIENCE_THREE_NIGHTS",
      );
      const result = await serial(async () => {
        await chain.assertCurrent(personId);
        session();
        return l.requestStay(personId, input, field(body.idempotencyKey), {
          version: "manual-review-v1",
          actor: actor.id,
        });
      });
      l.audit("portal.stay_requested", { actor: actor.id, stayId: result.id });
      json(201, result);
      return;
    }
    const stayPath = tail.match(
      /^\/stays\/([^/]+)\/(cancel|cancel-decision|confirmed|completed|reschedule)$/,
    );
    if (method === "POST" && stayPath) {
      const [, stayId, action] = stayPath;
      if (action === "cancel") {
        ensure(!admin, "FORBIDDEN_ROLE");
        json(200, p.requestCancellation(actor, stayId, body.reason));
        return;
      }
      if (action === "cancel-decision") {
        ensure(admin, "FORBIDDEN_ROLE");
        json(200, p.resolveCancellation(actor, personId, stayId, body));
        return;
      }
      if (["confirmed", "completed"].includes(action))
        ensure(admin, "FORBIDDEN_ROLE");
      if (admin) p.requireRole(actor, ["atendimento", "supervisao"]);
      ensure(
        !p
          .cancellations(personId)
          .some((c) => c.stay_id === stayId && c.status === "pending"),
        "CANCELLATION_PENDING",
      );
      if (action === "reschedule")
        ensure(
          Date.parse(field(body.departure)) -
            Date.parse(field(body.arrival)) ===
            3 * 86400000,
          "EXPERIENCE_THREE_NIGHTS",
        );
      const result = await serial(async () => {
        await chain.assertCurrent(personId);
        session();
        ensure(
          !p
            .cancellations(personId)
            .some((c) => c.stay_id === stayId && c.status === "pending"),
          "CANCELLATION_PENDING",
        );
        if (action === "reschedule" && !admin)
          ensure(
            l.stay(personId, stayId).status === "requested",
            "CONFIRMED_STAY_REQUIRES_REVIEW",
          );
        return action === "reschedule"
          ? l.reschedule(
              personId,
              stayId,
              field(body.arrival),
              field(body.departure),
            )
          : l.transition(personId, stayId, action as "confirmed" | "completed");
      });
      l.audit("portal.stay_" + action, { actor: actor.id, personId, stayId });
      json(200, result);
      return;
    }
    json(404, { error: "NOT_FOUND" });
  };
}
