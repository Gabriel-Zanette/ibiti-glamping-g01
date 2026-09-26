(() => {
  'use strict';
  const themes = {
    claro: ['Clareza editorial', '01 · Clareza editorial — creme e branco, com verde na seção da causa.'],
    papel: ['Papel e terra', '02 · Papel e terra — leitura acolhedora, com transições de fundo discretas.'],
    floresta: ['Dentro da floresta', '03 · Dentro da floresta — atmosfera mais imersiva, com leitura clara sobre verde profundo.'],
    nevoa: ['Névoa da manhã', '04 · Névoa da manhã — uma presença leve de verde ao longo da página.'],
    luz: ['Luz do bosque', '05 · Luz do bosque — direção escolhida, com luz difusa sobre creme e oliva.'],
  };
  const frame = document.getElementById('site-preview');
  const descriptions = document.getElementById('theme-description');
  let current = 'luz';
  let landingScroll = 0;
  let switchingTheme = false;
  const initial = new URLSearchParams(location.search).get('fundo');

  function selectTheme(theme, updateAddress = true) {
    if (!Object.hasOwn(themes, theme)) return;
    // Trocar o fundo mantém a posição na landing; outras rotas voltam ao início.
    try {
      const path = frame.contentWindow.location.pathname;
      if (path.endsWith('/index.html')) landingScroll = frame.contentWindow.scrollY;
      else landingScroll = 0;
    } catch { landingScroll = 0; }
    current = theme;
    switchingTheme = true;
    frame.src = `index.html?fundo=${theme}`;
    frame.title = `Prévia navegável: ${themes[theme][0]}`;
    descriptions.textContent = themes[theme][1];
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
    });
    ['open-top', 'open-version'].forEach(id => {
      document.getElementById(id).href = `index.html?fundo=${theme}`;
    });
    if (updateAddress) {
      const url = new URL(location.href);
      url.searchParams.set('fundo', theme);
      history.replaceState(null, '', url);
    }
  }
  frame.addEventListener('load', () => {
    if (switchingTheme) {
      try { frame.contentWindow.scrollTo({ top: landingScroll, behavior: 'instant' }); } catch { /* Abertura direta segue disponível. */ }
      switchingTheme = false;
    }
  });
  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.themeChoice !== current) selectTheme(button.dataset.themeChoice);
    });
  });
  document.querySelectorAll('button[data-device]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('preview-stage').dataset.device = button.dataset.device;
      document.querySelectorAll('button[data-device]').forEach(other => {
        other.setAttribute('aria-pressed', String(other === button));
      });
    });
  });
  if (initial && Object.hasOwn(themes, initial) && initial !== current) selectTheme(initial, false);
})();
