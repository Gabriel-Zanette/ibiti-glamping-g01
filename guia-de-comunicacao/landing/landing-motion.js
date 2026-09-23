(() => {
  'use strict';
  const root = document.documentElement;
  const sections = [...document.querySelectorAll('main > section')];
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const photo = document.querySelector('.hero-photo img');
  const counters = [...document.querySelectorAll('[data-count]')];
  const runningCounts = new Map();
  const sectionBounds = new Map();
  let revealObserver;
  let scrollFrame = 0;
  let documentHeight = 0;
  let photoTravel = 0;

  // A mesma cadência da landing anterior: subida de 26px, 750ms e cascata de 80ms.
  const groups = [
    '.hero-copy > *',
    '.section-intro > *',
    '.benefit-grid > *',
    '.cause-grid > div:first-child > *',
    '.cause-copy > *',
    '.numbers-head > *',
    '.stat-grid > *',
    '.offer-copy > *',
    '.offer-grid > div:last-child > *',
  ];
  const revealItems = [];
  groups.forEach(selector => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('motion-item');
      element.style.setProperty('--reveal-delay', `${index * 80}ms`);
      revealItems.push(element);
    });
  });
  const note = document.querySelector('.numbers-note');
  if (note) { note.classList.add('motion-item'); revealItems.push(note); }

  function finishCount(counter) {
    cancelAnimationFrame(runningCounts.get(counter));
    runningCounts.delete(counter);
    counter.textContent = counter.dataset.count;
  }

  function countUp(counter) {
    if (reducedMotion.matches) { finishCount(counter); return; }
    if (runningCounts.has(counter)) return;
    const target = Number(counter.dataset.count);
    let started;
    counter.textContent = '0';
    function tick(time) {
      started ??= time;
      const progress = Math.min((time - started) / 1300, 1);
      counter.textContent = String(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) runningCounts.set(counter, requestAnimationFrame(tick));
      else finishCount(counter);
    }
    runningCounts.set(counter, requestAnimationFrame(tick));
  }

  function reveal(element) {
    if (element.classList.contains('is-visible')) return;
    element.classList.add('is-visible');
    element.querySelectorAll('[data-count]').forEach(countUp);
  }

  function updateScroll() {
    scrollFrame = 0;
    const y = Math.max(0, window.scrollY);
    const viewport = window.innerHeight;
    const extent = Math.max(1, documentHeight - viewport);
    root.style.setProperty('--page-progress', String(Math.min(y / extent, 1)));
    if (reducedMotion.matches) return;

    sections.forEach(section => {
      const { top, height } = sectionBounds.get(section);
      if (top + height < y || top > y + viewport) return;
      const distance = Math.max(-1, Math.min(1, (y + viewport / 2 - top - height / 2) / viewport));
      section.style.setProperty('--section-drift', `${(distance * 42).toFixed(1)}px`);
    });
    if (photo) {
      const hero = sectionBounds.get(sections[0]);
      if (y < hero.top + hero.height) {
        photo.style.setProperty('--photo-drift', `${Math.min(y * .12, photoTravel).toFixed(1)}px`);
      }
    }
  }

  function scheduleScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }

  function measure() {
    sections.forEach(section => {
      const bounds = section.getBoundingClientRect();
      sectionBounds.set(section, { top: bounds.top + window.scrollY, height: bounds.height });
    });
    documentHeight = document.documentElement.scrollHeight;
    photoTravel = photo ? Math.min(48, photo.clientHeight * .08) : 0;
    scheduleScroll();
  }

  function configureMotion() {
    revealObserver?.disconnect();
    counters.forEach(finishCount);
    root.classList.toggle('motion-ready', !reducedMotion.matches);
    if (reducedMotion.matches) {
      revealItems.forEach(element => element.classList.add('is-visible'));
      sections.forEach(section => section.style.removeProperty('--section-drift'));
      photo?.style.removeProperty('--photo-drift');
      measure();
      return;
    }

    revealItems.forEach(element => element.classList.remove('is-visible'));
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) reveal(entry.target);
        // O conteúdo reaparece ao revisitar; alvos focados nunca ficam invisíveis.
        else if (!entry.target.contains(document.activeElement)) {
          entry.target.classList.remove('is-visible');
          entry.target.querySelectorAll('[data-count]').forEach(finishCount);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -24px 0px' });
    revealItems.forEach(element => revealObserver.observe(element));
    measure();
  }

  // Tab e links diretos continuam utilizáveis mesmo antes da animação de entrada.
  document.addEventListener('focusin', event => {
    const item = event.target.closest('.motion-item');
    if (item) reveal(item);
  });
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('pageshow', measure);
  reducedMotion.addEventListener('change', configureMotion);
  configureMotion();
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.querySelector('main'));
  document.fonts?.ready.then(measure);
})();
