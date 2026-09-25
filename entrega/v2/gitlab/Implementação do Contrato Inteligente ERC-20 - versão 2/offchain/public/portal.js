import { simulation, updateSimulations, money } from "/simulation.js";
const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const modes = {
  ibiti: {
    title: "A IBITI cuida para mim",
    level: "Custódia IBITI · menos etapas para você",
    fit: "Quero usar o programa sem operar uma carteira digital.",
    pro: "A equipe guarda o acesso à carteira dedicada a você e executa as operações autorizadas. Você acompanha tudo pela sua conta.",
    con: "Você depende da equipe para movimentar a carteira e da segurança com que ela guarda esse acesso.",
  },
  assisted: {
    title: "Eu cuido, com orientação",
    level: "Autocustódia assistida · algumas etapas guiadas",
    fit: "Quero ter o controle, mas preciso de ajuda para começar.",
    pro: "A equipe explica cada etapa. Só você pode autorizar pagamentos e usar a chave de acesso da carteira.",
    con: "Você precisa guardar sua recuperação em segurança e confirmar as operações. A orientação não transfere essa responsabilidade à equipe.",
  },
  direct: {
    title: "Eu cuido por conta própria",
    level: "Autocustódia direta · mais autonomia e cuidados",
    fit: "Já uso carteira digital e prefiro fazer a compra sozinho.",
    pro: "Você escolhe sua carteira compatível e faz a compra sem acompanhamento, com controle exclusivo do acesso.",
    con: "Você confere endereços, rede, saldo e taxas, além de guardar a recuperação. Se esses passos são novos para você, a opção com orientação pode ajudar.",
  },
};
const custodyIntro =
  "<p>A carteira é onde ficam seus tokens. Esta escolha define quem guarda o acesso e autoriza operações. Seu login no Passaporte e seus pedidos de hospedagem funcionam da mesma maneira nas três opções.</p>";
const statuses = {
  received: "Recebida",
  reviewing: "Em análise",
  needs_information: "Aguardando complemento",
  approved: "Aprovada",
  rejected: "Reprovada",
  withdrawn: "Retirada",
  requested: "Solicitada",
  confirmed: "Confirmada",
  completed: "Concluída",
  cancelled: "Cancelada",
  signing: "Autorização iniciada — confira sua carteira",
  prepared: "Pronta para autorizar",
  submitted: "Aguardando confirmação",
  failed: "Transação revertida",
  pending: "Análise pendente",
  return: "Devolução autorizada",
  retain: "Cota retida",
  deny: "Pedido não aprovado",
  custody_changed: "Custódia atualizada",
  interest_changed: "Quantidade de interesse atualizada",
};
const errors = {
  UNAUTHORIZED:
    "E-mail ou senha incorretos, ou sessão encerrada. Entre novamente.",
  PASSWORD_LENGTH: "Use uma senha com pelo menos 15 caracteres.",
  REGISTRATION_UNAVAILABLE:
    "Não foi possível criar esta conta. Se você já possui cadastro, entre ou procure o atendimento.",
  INVALID_CPF: "Confira o CPF informado.",
  FULL_NAME_REQUIRED: "Informe nome e sobrenome.",
  FORBIDDEN_ROLE: "Seu perfil não permite essa ação.",
  CHAIN_NOT_CONFIGURED:
    "A conexão com o contrato ainda não foi configurada. Sua candidatura continua disponível.",
  CHAIN_UNAVAILABLE:
    "A rede está indisponível. Tente novamente; seu cadastro está preservado.",
  NOT_ELIGIBLE:
    "A operação ainda não está habilitada. Confira a vigência, a aprovação e a confirmação do vínculo.",
  WALLET_NOT_REGISTERED:
    "A carteira foi vinculada à conta e aguarda habilitação no contrato pela equipe.",
  INSUFFICIENT_QUOTA: "Não há cotas livres suficientes.",
  VERSION_CONFLICT:
    "O cadastro foi atualizado em outra sessão. Atualize a página antes de decidir.",
  CHECKLIST_INCOMPLETE:
    "Conclua todas as verificações do checklist antes de aprovar.",
  PURCHASE_ALREADY_SUBMITTED:
    "A compra já foi enviada ou concluída. Uma transação enviada não pode ser cancelada pelo portal; acompanhe seu resultado.",
  PURCHASE_PENDING: "Você já tem uma compra em andamento. Retome-a abaixo.",
  CANCELLATION_PENDING: "Existe um cancelamento em análise para esta reserva.",
  RATE_LIMITED: "Muitas tentativas. Aguarde alguns minutos.",
  AWAITING_FINALITY:
    "Aguardando a confirmação da rede. Nenhuma cota será liberada antecipadamente.",
  FORBIDDEN_CUSTODY:
    "Esta ação deve ser feita pelo responsável pela carteira no modo escolhido.",
  WALLET_PROOF_REQUIRED:
    "Vincule primeiro esta carteira no modo de custódia selecionado.",
  CUSTODY_PROVIDER_UNAVAILABLE:
    "A execução assistida está disponível somente na demonstração local. A operação real depende do custodiante.",
  PURCHASE_REQUEST_REQUIRED:
    "O participante precisa solicitar a compra na própria conta antes de o financeiro preparar o pedido.",
  PURCHASE_REQUEST_NOT_FOUND:
    "Esta solicitação foi cancelada ou alterada. Atualize o acompanhamento.",
  PURCHASE_CONSENT_REQUIRED:
    "Aguarde o participante autorizar o valor na própria conta.",
  PERSON_NOT_VERIFIED: "A compra depende de cadastro aprovado.",
  EXPERIENCE_THREE_NIGHTS: "A experiência tem exatamente três noites.",
};
let current = null,
  detail = null,
  config = null,
  adminTab = "applications",
  memberTab = null,
  buyingMore = false,
  queueState = "active",
  caseView = "profile",
  busy = 0,
  polling = false;
function message(text) {
  const target = $("#case-dialog").open ? $("#dialog-message") : $("#message");
  target.textContent = text;
  if (text) target.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
async function api(path, body) {
  const r = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok)
    throw Error(
      errors[data.error] ?? `Não foi possível concluir: ${data.error}`,
    );
  return data;
}
const formData = (f) => Object.fromEntries(new FormData(f));
const date = (s) =>
  s
    ? new Date(s.length === 10 ? s + "T15:00:00Z" : s).toLocaleDateString(
        "pt-BR",
        { timeZone: "America/Sao_Paulo" },
      )
    : "—";
function cards(selected = "assisted") {
  return Object.entries(modes)
    .map(
      ([key, m]) =>
        `<label class="option"><span class="option-head"><input type="radio" name="custody" value="${key}" ${key === selected ? "checked" : ""}><strong>${m.title}</strong></span><span class="option-fit">${m.fit}</span><span class="option-detail"><span>${m.pro}</span><small>${m.con}</small></span></label>`,
    )
    .join("");
}
let signupStep = 1;
function changeSignupStep(n) {
  if (n > signupStep) {
    const fields = $(`[data-signup-step="${signupStep}"]`).querySelectorAll(
      "input",
    );
    for (const f of fields) if (!f.reportValidity()) return;
  }
  signupStep = n;
  document.body.classList.toggle("signup-followup", n > 1);
  document
    .querySelectorAll("[data-signup-step]")
    .forEach((e) => (e.hidden = Number(e.dataset.signupStep) !== n));
  $("[data-signup-prev]").hidden = n === 1;
  $("[data-signup-next]").hidden = n === 3;
  $("#signup-submit").hidden = n !== 3;
  const titles = [
    "Vamos nos conhecer.",
    "Seu jeito de participar.",
    "Proteja seu acesso.",
  ];
  $("#signup-title").textContent = titles[n - 1];
  $("#signup-progress").textContent =
    `${n} DE 3 · ${["SEUS DADOS", "SUAS ESCOLHAS", "SUA CONTA"][n - 1]}`;
  $("#signup-hint").textContent = [
    "Análise em até cinco dias úteis. Sem compromisso de compra.",
    "Simule seu interesse. A quantidade pode mudar após a aprovação.",
    "Crie uma senha e confira os termos antes de enviar.",
  ][n - 1];
  if (n === 3) {
    const f = formData($("#signup"));
    $("#signup-review").innerHTML =
      `<strong>${esc(f.name)}</strong><small>${esc(f.email)} · Interesse em ${Number(f.units)} IBT</small><small>${esc(modes[f.custody].title)}</small>`;
  }
  $("#signup-title").focus();
}
$("#custody-options").innerHTML = cards();
function access(login) {
  document.body.classList.toggle("login-view", login);
  $("#signup-panel").hidden = login;
  $("#login-panel").hidden = !login;
  $("#show-login").className = login ? "selected" : "subtle";
  $("#show-signup").className = login ? "subtle" : "selected";
}
$("#show-signup").onclick = () => {
  access(false);
  window.history.replaceState(
    null,
    "",
    location.pathname + location.search + "#cadastro",
  );
};
$("#show-login").onclick = () => {
  access(true);
  window.history.replaceState(
    null,
    "",
    location.pathname + location.search + "#entrar",
  );
};
async function run(button, fn) {
  if (button) button.disabled = true;
  busy++;
  message("");
  try {
    if (button) button.setAttribute("aria-busy", "true");
    await fn();
  } catch (e) {
    message(e.message);
  } finally {
    busy--;
    if (button) {
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  }
}
$("#signup").onsubmit = (e) => {
  e.preventDefault();
  if (signupStep < 3) {
    changeSignupStep(signupStep + 1);
    return;
  }
  for (const field of e.target.querySelectorAll("input")) {
    if (!field.checkValidity()) {
      changeSignupStep(
        Number(field.closest("[data-signup-step]").dataset.signupStep),
      );
      field.reportValidity();
      return;
    }
  }
  run(e.submitter, async () => {
    const data = formData(e.target);
    data.units = Number(data.units);
    data.consent = true;
    await api("/portal/signup", data);
    await api("/portal/login", { email: data.email, password: data.password });
    e.target.reset();
    changeSignupStep(1);
    await load();
    message("Candidatura recebida. Seu protocolo e prazo estão abaixo.");
  });
};
$("#login").onsubmit = (e) => {
  e.preventDefault();
  run(e.submitter, async () => {
    await api("/portal/login", formData(e.target));
    e.target.reset();
    await load();
  });
};
$("#logout").onclick = (e) =>
  run(e.target, async () => {
    await api("/portal/logout", {});
    memberTab = null;
    buyingMore = false;
    adminTab = "applications";
    document.body.classList.remove("signed-in");
    current = null;
    detail = null;
    $("#case-dialog").close();
    $(".intro").hidden = false;
    $("#access").hidden = false;
    $("#member").hidden = true;
    $("#admin").hidden = true;
    $("#logout").hidden = true;
    $("#identity").textContent = "Um lugar para pertencer.";
    access(true);
  });
async function load() {
  current = await api("/portal/me");
  document.body.classList.add("signed-in");
  $("#access").hidden = true;
  $(".intro").hidden = true;
  $("#logout").hidden = false;
  $("#identity").textContent = current.account.name;
  $("#member").hidden = current.account.role !== "member";
  $("#admin").hidden = current.account.role === "member";
  if (current.account.role === "member") renderMember();
  else await renderAdmin();
  updateSimulations();
}
function quota(q) {
  return `<div class="quota-main"><div><span class="eyebrow">PRONTAS PARA VIVER</span><div class="quota-value">${q.available}<span>cotas disponíveis</span></div></div><p class="quota-meta">${q.reserved} reservadas · ${q.used} utilizadas<small>${q.balance} IBT na sua carteira${q.pendingRelease ? " · Devolução em confirmação" : ""}</small></p></div>`;
}
function history(a) {
  return `<ul class="timeline">${a.history.map((h) => `<li><small>${date(h.at)}${h.actorName ? " · " + esc(h.actorName) : ""}</small><strong>${esc(statuses[h.status] ?? h.status)}</strong><div>${esc(h.message)}</div>${h.reason ? `<small>Registro interno: ${esc(h.reason)}</small>` : ""}</li>`).join("")}</ul>`;
}
function stays(data, admin = false) {
  return (
    data.stays
      .map((s) => {
        const c = data.cancellations.find((c) => c.stay_id === s.id);
        return `<div class="row"><div><strong>${date(s.arrival)} → ${date(s.departure)}</strong><div>${s.units} cota(s) · ${esc(statuses[s.status])}</div>${c ? `<small>Cancelamento: ${esc(statuses[c.status])}. ${esc(c.decision_reason ?? c.reason)}</small>` : ""}</div><div>${!admin && ["requested", "confirmed"].includes(s.status) && !c ? `<button class="subtle" data-cancel="${s.id}">Solicitar cancelamento</button>` : ""}${admin && ["atendimento", "supervisao"].includes(current.account.role) ? `${s.status === "requested" ? `<button data-stay="${s.id}" data-action="confirmed">Confirmar estadia</button>` : ""}${s.status === "confirmed" ? `<button data-stay="${s.id}" data-action="completed">Registrar conclusão</button>` : ""}${c?.status === "pending" ? `<button data-cancel-review="${s.id}">Analisar cancelamento</button>` : ""}` : ""}</div></div>`;
      })
      .join("") || "<p>Nenhuma hospedagem solicitada.</p>"
  );
}
const steps = {
  wallet: "Preparar carteira",
  registration: "Autorizar vínculo",
  preparation: "Preparar pedido",
  consent: "Autorizar valor",
  payment: "Concluir pagamento",
  confirmation: "Confirmar compra",
  completed: "Compra concluída",
  idle: "Escolher quantidade",
};
function responsible(stage, custody) {
  return {
    wallet: custody === "ibiti" ? "Financeiro" : "Participante",
    registration: "Cadastro ou supervisão",
    preparation: custody === "ibiti" ? "Financeiro" : "Participante",
    consent: "Participante",
    payment: custody === "ibiti" ? "Financeiro" : "Participante",
    confirmation: "Sistema",
    completed: "Concluída",
    idle: "Participante",
  }[stage];
}
function quoteValue(o) {
  const q = JSON.parse(o.details);
  return q.symbol === "tBRL"
    ? money(Math.round(Number(q.displayAmount) * 100))
    : `${esc(q.displayAmount)} ${esc(q.symbol)}`;
}
function purchaseHistory(data) {
  const closed = data.orders.filter(
    (o) => !["prepared", "signing", "submitted"].includes(o.status),
  );
  return (
    closed
      .map(
        (o) =>
          `<div class="row"><div><strong>${o.units} IBT · ${o.status === "confirmed" ? "Compra concluída" : esc(statuses[o.status])}</strong><small>${date(o.created_at)}</small></div><details><summary>Ver recibo</summary><p>${quoteValue(o)} · pagamento de teste</p><small class="break">${esc(o.tx_hash ?? "Não enviado à rede")}</small></details></div>`,
      )
      .join("") || '<p class="muted">Nenhuma compra concluída.</p>'
  );
}
function purchaseFlow(data, admin = false) {
  const a = data.application,
    p = data.purchase,
    base = admin ? "/portal/admin/people/" + data.account.personId : "/portal",
    role = current.account.role;
  if (!p || ["idle", "completed"].includes(p.stage)) return "";
  const institutional = a.custody === "ibiti",
    isFinance = admin && role === "financeiro",
    isRegistrar = admin && ["cadastro", "supervisao"].includes(role);
  const isBuyer = !admin && !institutional,
    owner = responsible(p.stage, a.custody),
    o = p.order;
  let action = "",
    help = "";
  if (p.stage === "wallet") {
    help = institutional
      ? "Uma carteira individual será vinculada a este participante. A equipe guarda o acesso; o participante usa somente o Passaporte."
      : "Conecte sua carteira e assine o vínculo. Essa etapa não realiza pagamento.";
    if (isFinance && institutional)
      action = config.localCustody
        ? `<button data-custody-setup="${base}">Preparar carteira de teste</button>`
        : `<button data-link="${base}">Vincular carteira institucional</button>`;
    if (isBuyer)
      action = `<button data-link="${base}">Conectar minha carteira</button>`;
  } else if (p.stage === "registration") {
    help =
      "A carteira foi vinculada. Cadastro ou supervisão confere e autoriza o vínculo para permitir a compra.";
    if (isRegistrar)
      action = `<button data-register="${esc(p.wallet)}">Autorizar vínculo para compra</button>`;
  } else if (p.stage === "preparation") {
    help =
      "A carteira está autorizada. Preparar o pedido confere preço, quantidade e disponibilidade; ainda não cobra.";
    if ((institutional && isFinance) || isBuyer)
      action = `<button data-prepare="${base}">Preparar pedido de ${p.units} IBT</button>`;
  } else if (p.stage === "consent") {
    help = admin
      ? "O pedido está disponível na conta do participante. Aguarde que ele confira e autorize o valor."
      : "Confira quantidade e valor. Ao autorizar, você permite que a equipe conclua este pedido de teste.";
    if (!admin)
      action = `<button data-consent="${o.id}">Autorizar pedido de ${quoteValue(o)}</button>`;
  } else if (p.stage === "payment") {
    help = institutional
      ? "O participante autorizou este valor. O financeiro pode executar a compra; as cotas serão liberadas após confirmação."
      : "Seu pedido está pronto. Autorize o pagamento na carteira para concluir.";
    if (isFinance && institutional)
      action = config.localCustody
        ? `<button data-execute="${o.id}" data-base="${base}">Concluir compra de teste</button>`
        : `<button data-pay="${o.id}" data-base="${base}">Autorizar pagamento na carteira</button>`;
    if (isBuyer)
      action = `<button data-pay="${o.id}" data-base="${base}">Pagar com minha carteira</button>`;
  } else if (p.stage === "confirmation") {
    help =
      "Acompanhamos a confirmação automaticamente. Não envie outro pagamento.";
    if (o?.status === "signing" && !o.tx_hash) {
      help =
        "A autorização foi iniciada. A equipe deve conferir a carteira antes de repetir qualquer operação.";
      if (isBuyer || isFinance)
        action = `<button data-recover="${o.id}" data-base="${base}">Recuperar acompanhamento</button>`;
    }
  }
  if (!action && !["confirmation"].includes(p.stage))
    action = `<p class="waiting">Aguardando: <strong>${owner}</strong>. Sua próxima ação aparecerá aqui.</p>`;
  const total = o
    ? quoteValue(o)
    : money(config.economicReference.unitCents * p.units);
  const cancel =
    !admin && p.request && !p.request.order_id
      ? `<button class="subtle" data-request-cancel="${p.request.id}">Alterar ou cancelar solicitação</button>`
      : o?.status === "prepared" && (!admin || isFinance)
        ? `<button class="subtle" data-order-cancel="${o.id}" data-base="${base}">Desfazer pedido</button>`
        : "";
  const waiting = !action.includes("<button") && p.stage !== "confirmation";
  const participantTitle =
    waiting && !admin ? "Estamos cuidando do seu pedido." : steps[p.stage];
  const stepKeys = [
    "wallet",
    "registration",
    "preparation",
    ...(institutional ? ["consent"] : []),
    "payment",
    "confirmation",
  ];
  return `<div class="purchase-summary"><div><span class="eyebrow">SEU PEDIDO</span><strong>${p.units} IBT</strong></div><div><span class="eyebrow">VALOR TOTAL</span><strong>${total}</strong></div></div><div class="next-action"><span class="status-dot">${admin ? esc(owner) : waiting ? "Com a equipe IBITI" : "Etapa atual"}</span><h3>${participantTitle}</h3><p>${waiting && !admin ? "Você será informado aqui quando precisar agir." : help}</p>${waiting ? "" : action}</div><details class="order-details"><summary>Detalhes e etapas do pedido</summary><p>${esc(modes[a.custody].title)} · ${p.units} cota(s) após a confirmação.</p><ol class="steps">${stepKeys.map((k) => `<li ${k === p.stage ? 'aria-current="step"' : ""}>${steps[k]}</li>`).join("")}</ol>${o?.tx_hash ? `<small class="break">Transação: ${esc(o.tx_hash)}</small>` : ""}${cancel}</details>`;
}
function accountPanel() {
  const a = current.application,
    canChange =
      current.quota.balance === 0 &&
      !current.orders.some((o) =>
        ["signing", "submitted", "confirmed"].includes(o.status),
      );
  return `<section><h2>Minha conta</h2><dl><dt>Nome</dt><dd>${esc(current.account.name)}</dd><dt>E-mail</dt><dd>${esc(current.account.email)}</dd><dt>Cadastro</dt><dd>${esc(statuses[a.status])}</dd><dt>Carteira</dt><dd>${esc(modes[a.custody].title)}</dd></dl>${canChange ? `<details><summary>Alterar quem cuida dos tokens</summary>${custodyIntro}<form id="change-custody"><div class="custody">${cards(a.custody)}</div><p class="muted">A mudança desfaz solicitações e pedidos ainda não enviados.</p><button>Salvar preferência</button></form></details>` : `<p>${esc(modes[a.custody].pro)}</p>`}<details><summary>Histórico do cadastro</summary>${history(a)}</details></section>`;
}
function renderMember() {
  const a = current.application,
    q = current.quota,
    p = current.purchase;
  if (a.status !== "approved") {
    $("#member").innerHTML =
      `<section><span class="eyebrow">MINHA CANDIDATURA</span><h2>${esc(statuses[a.status])}</h2><p>${esc(a.message)}</p><p>Resposta até <strong>${date(a.dueDate)}</strong> · ${esc(a.deadline.label)}</p>${a.status === "needs_information" ? `<form id="complement"><label>Telefone<input name="phone" value="${esc(a.phone)}" required></label><label>Informações solicitadas<textarea name="note" required></textarea></label><button>Enviar complemento</button></form>` : ""}<small>Compra disponível após aprovação.</small></section><details class="account-fold"><summary>Meus dados e preferências</summary>${accountPanel()}</details>`;
    return;
  }
  memberTab ??= q.balance > 0 ? "experiences" : "purchases";
  const tabs = {
    ...(q.balance > 0 ? { experiences: "Experiências" } : {}),
    purchases: "Minhas compras",
    account: "Minha conta",
  };
  const nav = `<div class="tabs" role="tablist" aria-label="Seu Passaporte">${Object.entries(
    tabs,
  )
    .map(
      ([key, label]) =>
        `<button role="tab" id="member-tab-${key}" aria-controls="member-panel" aria-selected="${memberTab === key}" tabindex="${memberTab === key ? 0 : -1}" class="${memberTab === key ? "selected" : "subtle"}" data-member-tab="${key}">${label}</button>`,
    )
    .join("")}</div>`;
  let content = "";
  if (memberTab === "experiences")
    content = `<section><span class="eyebrow">SEU PASSAPORTE</span><h2>Suas experiências</h2>${quota(q)}<details class="booking"><summary>Solicitar hospedagem <span aria-hidden="true">↗</span></summary><form id="stay"><div class="grid"><label>Check-in<input type="date" name="arrival" required></label><label>Cotas para esta reserva<input name="units" type="number" min="1" max="${Math.max(1, q.available)}" value="1" required></label></div><p class="muted">Três noites, até cinco pessoas por cota. Sujeito à confirmação de disponibilidade.</p><button ${q.available < 1 ? "disabled" : ""}>Enviar solicitação</button></form></details><div class="section-heading"><h3>Suas reservas</h3><span class="muted">Cancelamento sob análise da equipe</span></div>${stays(current)}</section>`;
  else if (memberTab === "account") content = accountPanel();
  else {
    const active = p && !["idle", "completed"].includes(p.stage);
    const showForm =
      !active && q.balance < 20 && (q.balance === 0 || buyingMore);
    content = `<section><span class="eyebrow">AQUISIÇÃO</span><h2>${active ? "Acompanhe sua compra" : showForm ? (q.balance ? "Comprar mais IBT" : "Escolha seus tokens") : "Minhas compras"}</h2>${active ? purchaseFlow(current) : showForm ? `<p>Escolha a quantidade do seu pedido.</p><form id="request-purchase">${simulation(q.balance ? 1 : a.units, 20 - q.balance)}<p><strong>${esc(modes[a.custody].title)}</strong></p><p class="muted">${a.custody === "ibiti" ? "Você confere e autoriza o valor antes do pagamento." : "Você autoriza o pagamento pela sua carteira."}</p><button>Solicitar compra de IBT</button></form>${q.balance === 0 ? '<button class="subtle" data-member-tab="account">Alterar formato de custódia</button>' : '<button class="subtle" data-stop-buy="true">Voltar às compras</button>'}` : `<p>Você possui <strong>${q.balance} IBT</strong>. Suas cotas estão na aba Experiências.</p>${q.balance < 20 ? '<button data-new-buy="true">Comprar mais IBT</button>' : "<p>Limite de 20 IBT atingido.</p>"}`}</section>${current.orders.some((o) => !["prepared", "signing", "submitted"].includes(o.status)) ? `<section><h3>Histórico de compras</h3>${purchaseHistory(current)}</section>` : ""}`;
  }
  $("#member").innerHTML =
    nav +
    `<div id="member-panel" role="tabpanel" aria-labelledby="member-tab-${memberTab}">${content}</div>`;
  updateSimulations();
}
const adminTabs = {
  applications: "Candidaturas",
  purchases: "Compras",
  stays: "Hospedagens",
};
const roleTabs = {
  financeiro: ["purchases"],
  cadastro: ["applications", "purchases"],
  atendimento: ["stays"],
  supervisao: ["applications", "purchases", "stays"],
};
function deadlineBadge(a) {
  return `<span class="badge deadline ${esc(a.deadline.state)}">${esc(a.deadline.label)}</span>`;
}
async function renderAdmin() {
  const allowed = roleTabs[current.account.role];
  if (!allowed.includes(adminTab)) adminTab = allowed[0];
  const filter = $("#filter")?.value ?? "",
    old = $("#filter");
  if (old) old.disabled = true;
  let list;
  try {
    list = await api("/portal/admin/" + adminTab);
  } catch (error) {
    if (old) old.disabled = false;
    throw error;
  }
  let visible = list;
  if (adminTab === "purchases")
    visible = list.filter((r) =>
      queueState === "completed"
        ? r.purchase.stage === "completed"
        : r.purchase.stage !== "completed",
    );
  if (adminTab === "applications")
    visible = list.filter((r) =>
      queueState === "completed"
        ? ["approved", "rejected", "withdrawn"].includes(r.application.status)
        : !["approved", "rejected", "withdrawn"].includes(r.application.status),
    );
  const labels = {
      applications: "Abrir ficha",
      purchases: "Abrir pedido",
      stays: "Ver hospedagens",
    },
    views = { applications: "profile", purchases: "purchase", stays: "stays" };
  const roleName = {
    financeiro: "Financeiro",
    cadastro: "Cadastro",
    atendimento: "Atendimento",
    supervisao: "Supervisão",
  }[current.account.role];
  $("#admin").innerHTML =
    `<div class="workspace-heading"><div><span class="eyebrow">EQUIPE IBITI</span><h1>${roleName}</h1></div><span class="workspace-count">${visible.length} ${queueState === "completed" ? "concluídos" : "em acompanhamento"}</span></div>${allowed.length > 1 ? `<div class="tabs" role="tablist" aria-label="Áreas da equipe">${allowed.map((key) => `<button role="tab" id="tab-${key}" aria-controls="admin-panel" aria-selected="${key === adminTab}" tabindex="${key === adminTab ? 0 : -1}" class="${key === adminTab ? "selected" : "subtle"}" data-tab="${key}">${adminTabs[key]}</button>`).join("")}</div>` : ""}<section id="admin-panel" ${allowed.length > 1 ? `role="tabpanel" aria-labelledby="tab-${adminTab}"` : ""}><div class="section-heading"><h2>${adminTabs[adminTab]}</h2><button class="text-button" data-reload="queue">Atualizar lista</button></div><div class="queue-tools"><label>Buscar participante<input id="filter" type="search" value="${esc(filter)}" placeholder="Nome ou e-mail"></label>${adminTab !== "stays" ? `<label>Exibir<select id="queue-state"><option value="active" ${queueState === "active" ? "selected" : ""}>Em andamento</option><option value="completed" ${queueState === "completed" ? "selected" : ""}>Concluídas</option></select></label>` : ""}</div><div id="queue">${visible.map((d) => `<div class="row queue-row" data-search="${esc((d.account.name + " " + d.account.email).toLowerCase())}"><div class="person-cell"><strong>${esc(d.account.name)}</strong><small>${esc(d.account.email)}</small></div><div class="state-cell">${adminTab === "applications" ? `${deadlineBadge(d.application)}<small>${esc(statuses[d.application.status])}</small>` : adminTab === "purchases" ? `<span class="badge">${steps[d.purchase.stage]}</span><small>${d.purchase.stage === "completed" ? d.purchase.held + " IBT" : d.purchase.units + " IBT · " + responsible(d.purchase.stage, d.custody)}</small>` : `<span class="badge">${d.stays.filter((s) => ["requested", "confirmed"].includes(s.status)).length} reservas ativas</span><small>${d.quota.available} cotas livres</small>`}</div><button class="subtle" data-person="${d.account.personId}" data-view="${views[adminTab]}">${labels[adminTab]}</button></div>`).join("") || '<div class="empty-state"><strong>Tudo em dia por aqui.</strong><p>Nenhum item nesta seleção.</p></div>'}</div><p id="queue-search-empty" class="muted" hidden>Nenhum participante encontrado. Tente outro nome ou e-mail.</p></section>`;
  applyFilter(filter);
  if (detail && $("#case-dialog").open)
    await showDetail(detail.account.personId, caseView);
}
function applyFilter(value) {
  const rows = [...document.querySelectorAll("[data-search]")];
  for (const row of rows)
    row.hidden = !row.dataset.search.includes(value.toLowerCase());
  const empty = $("#queue-search-empty");
  if (empty) empty.hidden = !value.trim() || rows.some((row) => !row.hidden);
}
async function showDetail(person, view = "profile") {
  caseView = view;
  detail = await api("/portal/admin/people/" + person);
  const { account, application: a, quota: q } = detail,
    base = "/portal/admin/people/" + person;
  const review = ["cadastro", "supervisao"].includes(current.account.role);
  $("#case-title").textContent =
    (view === "profile"
      ? "Ficha · "
      : view === "stays"
        ? "Hospedagens · "
        : "Compra · ") + account.name;
  $("#dialog-message").textContent = "";
  if (!$("#case-dialog").open) $("#case-dialog").showModal();
  if (view === "stays") {
    $("#detail").innerHTML =
      `${quota(q)}<h3>Reservas e solicitações</h3>${stays(detail, true)}<div id="cancellation-editor"></div>`;
    return;
  }
  if (view === "purchase") {
    $("#detail").innerHTML =
      detail.purchase.stage === "completed"
        ? `<p>${detail.quota.balance} IBT na carteira. Não há pagamento a executar.</p>${purchaseHistory(detail)}`
        : purchaseFlow(detail, true);
    updateSimulations();
    return;
  }
  $("#detail").innerHTML =
    `<section><dl class="profile-data"><dt>Contato</dt><dd>${esc(account.email)} · ${esc(a.phone)}</dd>${detail.cpf ? `<dt>CPF</dt><dd>${esc(detail.cpf)}</dd>` : ""}<dt>Interesse</dt><dd>${a.units} IBT</dd><dt>Custódia</dt><dd>${esc(modes[a.custody].title)}</dd><dt>Estado</dt><dd>${esc(statuses[a.status])}</dd><dt>Prazo</dt><dd>${date(a.dueDate)}</dd></dl>${
      review && !["approved", "withdrawn"].includes(a.status)
        ? `<form id="decision"><fieldset class="review-checks"><legend>Conferências para aprovação</legend>${Object.entries(
            {
              identity:
                "Identidade e unicidade conferidas por evidência externa",
              contact: "Contato confirmado",
              complete: "Informações necessárias completas",
              rights: "Ciência dos direitos, limites e ausência de revenda",
              limit: "Quantidade compatível com o teto por pessoa",
              review: "Revisão fundamentada concluída",
            },
          )
            .map(
              ([k, v]) =>
                `<label class="check"><input name="${k}" type="checkbox" ${a.checklist?.[k] ? "checked" : ""}><span>${v}</span></label>`,
            )
            .join(
              "",
            )}</fieldset><label>Decisão<select name="status"><option value="reviewing">Iniciar análise</option><option value="needs_information">Solicitar complemento</option><option value="approved">Aprovar</option><option value="rejected">Reprovar</option></select></label><label>Fundamentação interna e referência das evidências<textarea name="reason" required maxlength="2000"></textarea></label><label>Resposta que o candidato verá<textarea name="message" required maxlength="1000"></textarea></label><button>Registrar decisão</button></form>`
        : ""
    }<details><summary>Histórico da análise</summary>${history(a)}</details></section>`;
}
async function wallet() {
  if (!window.ethereum)
    throw Error(
      "Abra uma carteira compatível no navegador para esta etapa. O login e as hospedagens continuam disponíveis sem carteira.",
    );
  const chain = await window.ethereum.request({ method: "eth_chainId" });
  if (Number(BigInt(chain)) !== config.chainId)
    throw Error("Selecione a rede " + config.chainId + " na sua carteira.");
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
}
async function send(tx) {
  const from = await wallet();
  if (tx.from && tx.from.toLowerCase() !== from.toLowerCase())
    throw Error("Selecione a carteira vinculada à compra.");
  return window.ethereum.request({
    method: "eth_sendTransaction",
    params: [{ from, to: tx.to, data: tx.data }],
  });
}
async function waitReceipt(hash) {
  for (let i = 0; i < 60; i++) {
    const r = await window.ethereum.request({
      method: "eth_getTransactionReceipt",
      params: [hash],
    });
    if (r) {
      if (BigInt(r.status) !== 1n)
        throw Error("A autorização foi revertida. Confira saldo e taxas.");
      return;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw Error(
    "A autorização ainda está pendente. Confira a carteira antes de tentar novamente.",
  );
}
document.addEventListener("submit", (e) => {
  const f = e.target;
  if (f.id === "signup" || f.id === "login") return;
  e.preventDefault();
  run(e.submitter, async () => {
    const data = formData(f);
    if (f.id === "request-purchase") {
      await api("/portal/purchase-request", {
        units: Number(data.units),
        version: current.application.version,
      });
      buyingMore = false;
    } else if (f.id === "interest")
      await api("/portal/interest", {
        units: Number(data.units),
        version: current.application.version,
      });
    else if (f.id === "change-custody")
      await api("/portal/custody", {
        custody: data.custody,
        version: current.application.version,
      });
    else if (f.id === "complement")
      await api("/portal/complement", {
        ...data,
        version: current.application.version,
      });
    else if (f.id === "decision")
      await api(
        "/portal/admin/people/" + detail.account.personId + "/decision",
        {
          status: data.status,
          reason: data.reason,
          message: data.message,
          version: detail.application.version,
          checklist: Object.fromEntries(
            [
              "identity",
              "contact",
              "complete",
              "rights",
              "limit",
              "review",
            ].map((k) => [k, data[k] === "on"]),
          ),
        },
      );
    else if (f.id === "cancellation-decision")
      await api(
        "/portal/admin/people/" +
          detail.account.personId +
          "/stays/" +
          f.dataset.stayId +
          "/cancel-decision",
        data,
      );
    else if (f.id === "stay") {
      const departure = new Date(
        Date.parse(data.arrival + "T12:00:00Z") + 3 * 86400000,
      )
        .toISOString()
        .slice(0, 10);
      await api("/portal/stays", {
        units: Number(data.units),
        arrival: data.arrival,
        departure,
        idempotencyKey: crypto.randomUUID(),
      });
    } else if (f.dataset.buy)
      await api(f.dataset.buy + "/purchase/prepare", {
        wallet: await wallet(),
        units: Number(data.units),
      });
    await load();
    message(
      f.id === "request-purchase"
        ? "Solicitação enviada. Acompanhe abaixo a próxima etapa e seu responsável."
        : f.id === "decision"
          ? "Decisão registrada e disponibilizada ao candidato."
          : f.id === "stay"
            ? "Pedido de hospedagem enviado. Aguarde a confirmação da equipe."
            : f.dataset.buy
              ? "Pedido preparado. Confira o valor antes de autorizar o pagamento."
              : f.id === "interest"
                ? "Quantidade salva. Nenhum token foi reservado e nenhuma cobrança foi feita."
                : "Alteração salva.",
    );
  });
});
document.addEventListener("change", (e) => {
  if (e.target.id === "queue-state") {
    queueState = e.target.value;
    run(null, renderAdmin);
  }
});
document.addEventListener("input", (e) => {
  if (e.target.id === "filter") applyFilter(e.target.value);
});
$("#close-dialog").onclick = () => $("#case-dialog").close();
$("#case-dialog").addEventListener("close", () => {
  const person = detail?.account.personId;
  detail = null;
  $("#dialog-message").textContent = "";
  if (person) document.querySelector(`[data-person="${person}"]`)?.focus();
});
document.addEventListener("keydown", (e) => {
  if (
    !e.target.matches("[role=tab]") ||
    !["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
  )
    return;
  e.preventDefault();
  const tabs = [
      ...e.target.closest("[role=tablist]").querySelectorAll("[role=tab]"),
    ],
    i = tabs.indexOf(e.target);
  const next =
    e.key === "Home"
      ? 0
      : e.key === "End"
        ? tabs.length - 1
        : (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].click();
});
document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const d = b.dataset;
  if (!Object.keys(d).length) return;
  if (b.hasAttribute("data-signup-next")) {
    changeSignupStep(signupStep + 1);
    return;
  }
  if (b.hasAttribute("data-signup-prev")) {
    changeSignupStep(signupStep - 1);
    return;
  }
  run(b, async () => {
    if (d.memberTab) {
      memberTab = d.memberTab;
      buyingMore = false;
      renderMember();
      $("#member-tab-" + memberTab)?.focus();
      return;
    }
    if (d.newBuy) {
      buyingMore = true;
      memberTab = "purchases";
      renderMember();
      return;
    }
    if (d.stopBuy) {
      buyingMore = false;
      renderMember();
      return;
    }
    if (d.requestCancel) {
      await api("/portal/purchase-request/cancel", { id: d.requestCancel });
      buyingMore = true;
      await load();
      message("Solicitação cancelada. Você pode escolher outra quantidade.");
      return;
    }
    if (d.custodySetup) {
      await api(d.custodySetup + "/custody/prepare-wallet", {});
      await load();
      message(
        "Carteira preparada. A próxima ação é de cadastro ou supervisão: autorizar o vínculo.",
      );
      return;
    }
    if (d.prepare) {
      const data = current.account.role === "member" ? current : detail;
      await api(d.prepare + "/purchase/prepare", {
        wallet: data.purchase.wallet,
        units: data.purchase.units,
      });
      await load();
      message(
        data.application.custody === "ibiti"
          ? "Pedido preparado. O participante deve autorizar o valor em sua conta."
          : "Pedido preparado. Confira o valor e pague com sua carteira.",
      );
      return;
    }
    if (d.execute) {
      if (
        !confirm(
          "Concluir a compra autorizada usando apenas recursos da rede de teste?",
        )
      )
        return;
      await api(d.base + "/purchase/" + d.execute + "/execute", {});
      await load();
      message(
        "Compra executada. A confirmação libera as cotas na conta do participante.",
      );
      return;
    }
    if (d.tab) {
      adminTab = d.tab;
      queueState = "active";
      if ($("#filter")) $("#filter").value = "";
      await renderAdmin();
      $("#tab-" + adminTab).focus();
      return;
    }
    if (d.reload) {
      await renderAdmin();
      message("Lista atualizada.");
      return;
    }
    if (d.person) {
      await showDetail(d.person, d.view);
      return;
    }

    if (d.link) {
      const w = await wallet(),
        challenge = await api(d.link + "/wallet/challenge", { wallet: w });
      const hex =
        "0x" +
        Array.from(new TextEncoder().encode(challenge.message))
          .map((v) => v.toString(16).padStart(2, "0"))
          .join("");
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [hex, w],
      });
      await api(d.link + "/wallet/verify", { id: challenge.id, signature });
    } else if (d.register) {
      const tx = await api(
        "/portal/admin/people/" +
          detail.account.personId +
          "/onchain-registration",
        { wallet: d.register, executeLocal: Boolean(config.localCustody) },
      );
      if (config.localCustody) {
        await load();
        message("Vínculo autorizado. O financeiro já pode preparar o pedido.");
        return;
      }
      const hash = await send(tx);
      message("Autorização enviada. Aguardando confirmação da rede…");
      await waitReceipt(hash);
      await api(
        "/portal/admin/people/" + detail.account.personId + "/sync",
        {},
      );
      await load();
      message(
        "Autorização enviada com sucesso. O status da carteira acompanha a confirmação da rede automaticamente.",
      );
      return;
    } else if (d.pay) {
      const data = current.account.role === "member" ? current : detail,
        o = data.orders.find((o) => o.id === d.pay),
        q = JSON.parse(o.details);
      if (
        !confirm(
          `Autorizar a compra de ${o.units} IBT por ${q.displayAmount} ${q.symbol}, mais as taxas da rede?`,
        )
      )
        return;
      const approval = await send(q.approval);
      message("Autorização enviada. Aguardando confirmação na carteira…");
      await waitReceipt(approval);
      await api(d.base + "/purchase/" + d.pay + "/signing", {});
      let hash;
      try {
        hash = await send(q);
      } catch (error) {
        if (error.code === 4001) {
          await api(d.base + "/purchase/" + d.pay + "/abort-signing", {
            reason: "wallet_rejected",
          });
          await load();
          throw Error(
            "Assinatura recusada. Você pode alterar a custódia ou retomar a compra.",
          );
        }
        throw error;
      }
      try {
        localStorage.setItem("ibiti:tx:" + d.pay, hash);
      } catch {
        /* O envio ao servidor continua se o armazenamento local estiver indisponível. */
      }
      try {
        await api(d.base + "/purchase/" + d.pay + "/submitted", { hash });
      } catch (error) {
        message(
          "Compra enviada: " +
            hash +
            ". Guarde este hash. Não repita a compra. " +
            error.message,
        );
        return;
      }
    } else if (d.consent)
      await api("/portal/purchase/" + d.consent + "/consent", {});
    else if (d.recover) {
      const hash =
        localStorage.getItem("ibiti:tx:" + d.recover) ||
        prompt("Cole o hash da compra enviada. Não envie uma nova compra.");
      if (!hash) return;
      await api(d.base + "/purchase/" + d.recover + "/submitted", { hash });
    } else if (d.orderCancel)
      await api(d.base + "/purchase/" + d.orderCancel + "/cancel", {});
    else if (d.cancel) {
      const reason = prompt(
        "Descreva o motivo do cancelamento. A equipe analisará a devolução da cota.",
      );
      if (!reason) return;
      await api("/portal/stays/" + d.cancel + "/cancel", { reason });
    } else if (d.cancelReview) {
      $("#cancellation-editor").innerHTML =
        `<form id="cancellation-decision" data-stay-id="${esc(d.cancelReview)}"><h3>Análise do cancelamento</h3><label>Resultado<select name="decision"><option value="return">Cancelar e devolver a cota integral</option><option value="retain">Cancelar e reter a cota</option><option value="deny">Não aprovar o pedido de cancelamento</option></select></label><label>Fundamentação e condições comunicadas<textarea name="reason" required maxlength="2000"></textarea></label><small>Casos de crédito parcial permanecem em análise. Nenhuma meia cota será criada.</small><button>Registrar decisão de cancelamento</button></form>`;
      return;
    } else if (d.stay)
      await api(
        "/portal/admin/people/" +
          detail.account.personId +
          "/stays/" +
          d.stay +
          "/" +
          d.action,
        {},
      );
    await load();
    message(
      d.consent
        ? "Pedido autorizado. A equipe financeira pode realizar o pagamento."
        : d.orderCancel
          ? "Preparação desfeita. Você pode mudar a quantidade ou a preferência de custódia."
          : d.link
            ? "Carteira vinculada. A equipe irá autorizar a compra."
            : d.cancel
              ? "Cancelamento solicitado. A cota permanece comprometida até a decisão da equipe."
              : d.stay
                ? "Situação da hospedagem atualizada."
                : "Pagamento enviado. A confirmação será acompanhada automaticamente.",
    );
  });
});
(async () => {
  config = await api("/config");
  try {
    await load();
  } catch {
    access(location.hash === "#entrar");
  }
})().catch((e) => message(e.message));

// Só consulta resultados; nunca envia pagamentos ou autorizações em segundo plano.
setInterval(async () => {
  if (!current || busy || polling || document.hidden) return;
  polling = true;
  try {
    const member = current.account.role === "member";
    const data = member
      ? current
      : $("#case-dialog").open && caseView === "purchase"
        ? detail
        : null;
    if (!data) return;
    const base = member
      ? "/portal"
      : "/portal/admin/people/" + data.account.personId;
    for (const order of data.orders.filter(
      (o) => o.status === "submitted" && o.tx_hash,
    )) {
      await api(base + "/purchase/" + order.id + "/refresh", {});
    }
    if (data.application.status === "approved") {
      try {
        await api(base + "/sync", {});
      } catch {
        /* Cadastro continua acessível durante falha de RPC. */
      }
    }
    const identity = await api("/portal/me");
    if (identity.account.id !== current.account.id) {
      detail = null;
      memberTab = null;
      $("#case-dialog").close();
      await load();
      message(
        "A conta foi trocada em outra aba. Confira o perfil antes de continuar.",
      );
      return;
    }
    const next = member ? identity : await api(base);
    const snapshot = (d) =>
      JSON.stringify([
        d.application.version,
        d.purchase,
        d.orders,
        d.wallets,
        [
          d.quota.balance,
          d.quota.available,
          d.quota.reserved,
          d.quota.used,
          d.quota.pendingRelease,
        ],
        d.stays,
        d.cancellations,
      ]);
    if (
      snapshot(next) !== snapshot(data) &&
      !document.activeElement?.closest("form")
    ) {
      if (member) {
        current = next;
        renderMember();
        updateSimulations();
      } else await showDetail(data.account.personId, caseView);
      message("Seu acompanhamento foi atualizado.");
    }
  } catch {
    /* Falhas transitórias serão consultadas novamente sem duplicar compras. */
  } finally {
    polling = false;
  }
}, 15000);
