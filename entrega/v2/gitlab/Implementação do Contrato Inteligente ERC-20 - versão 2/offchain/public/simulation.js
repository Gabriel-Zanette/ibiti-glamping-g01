let reference = null;
export const money = (cents) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(cents) / 100,
  );
export function simulation(units = 1, max = 20) {
  return `<div class="simulation" data-simulation><label>Quantidade de IBT<input name="units" type="number" min="1" max="${Math.min(20, Number(max))}" step="1" value="${Number.isInteger(Number(units)) ? Number(units) : 1}" required></label><output aria-live="polite" aria-atomic="true"></output><small>Cada cota: três noites para até cinco pessoas, uma vez durante a vigência. Sujeito à disponibilidade.</small></div>`;
}
export function updateSimulations(root = document) {
  for (const box of root.querySelectorAll("[data-simulation]")) {
    const input = box.querySelector("[name=units]"),
      units = Number(input.value),
      out = box.querySelector("output");
    if (!Number.isInteger(units) || units < 1 || units > Number(input.max)) {
      out.textContent = `Escolha de 1 a ${input.max} IBT.`;
      continue;
    }
    out.innerHTML = `<strong>${reference ? money(reference.unitCents * units) : "Consultando valor…"}</strong><span>${units} IBT · ${units} cota${units === 1 ? "" : "s"} de experiência</span>`;
  }
}
export async function loadSimulationPrice() {
  try {
    const r = await fetch("/simulation");
    if (!r.ok) throw Error();
    const data = await r.json();
    if (
      !Number.isSafeInteger(data.unitCents) ||
      data.unitCents <= 0 ||
      data.currency !== "BRL"
    )
      throw Error();
    reference = data;
  } catch {
    reference = null;
  }
  updateSimulations();
  if (!reference)
    for (const out of document.querySelectorAll("[data-simulation] output"))
      out.textContent += " · Valor indisponível. O cadastro pode continuar.";
}
if (typeof document !== "undefined") {
  document.addEventListener("input", (e) => {
    if (e.target.closest("[data-simulation]")) updateSimulations();
  });
  for (const host of document.querySelectorAll("[data-public-simulation]")) {
    const n = Number(new URLSearchParams(location.search).get("units"));
    host.innerHTML = simulation(
      Number.isInteger(n) && n >= 1 && n <= 20 ? n : 1,
    );
  }
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link || !document.body.classList.contains("landing-page")) return;
    const url = new URL(link.href),
      units = Number(
        document.querySelector("[data-simulation] [name=units]")?.value,
      );
    if (
      url.origin === location.origin &&
      url.pathname === "/conta" &&
      url.hash !== "#entrar" &&
      Number.isInteger(units) &&
      units >= 1 &&
      units <= 20
    ) {
      url.searchParams.set("units", String(units));
      link.href = url.href;
    }
  });
  updateSimulations();
  void loadSimulationPrice();
}
