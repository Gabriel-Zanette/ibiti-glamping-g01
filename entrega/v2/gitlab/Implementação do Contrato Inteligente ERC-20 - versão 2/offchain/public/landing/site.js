(() => {
  "use strict";
  const themes = ["claro", "papel", "floresta", "nevoa", "luz"];
  const params = new URLSearchParams(location.search);
  const theme = themes.includes(params.get("fundo"))
    ? params.get("fundo")
    : "luz";
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    // O fundo acompanha a jornada; nunca modifica conteúdo, preço ou estrutura.
    document.querySelectorAll("a[data-journey]").forEach((link) => {
      const url = new URL(link.href);
      url.searchParams.set("fundo", theme);
      link.href = url.href;
    });
    const revealTopic = () => {
      const target = document.getElementById(
        decodeURIComponent(location.hash.slice(1)),
      );
      if (target?.matches("details.topic")) target.open = true;
    };
    revealTopic();
    window.addEventListener("hashchange", revealTopic);
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".header-nav");
    if (!toggle || !nav) return;
    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menu";
      nav.classList.remove("is-open");
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Fechar" : "Menu";
      nav.classList.toggle("is-open", open);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu();
        toggle.focus();
      }
    });
  });
})();
