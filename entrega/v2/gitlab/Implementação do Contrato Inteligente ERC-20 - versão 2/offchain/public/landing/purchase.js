(() => {
  'use strict';
  const unitPriceCents = 3705519;
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const quantity = document.getElementById('quantity');
  const decrease = document.getElementById('decrease');
  const increase = document.getElementById('increase');
  const quantityError = document.getElementById('quantity-error');
  const fullName = document.getElementById('full-name');
  const email = document.getElementById('email');
  const registrationForm = document.getElementById('registration-form');
  const readQuantity = () => {
    const value = Number(quantity.value);
    return Number.isInteger(value) && value >= 1 && value <= 20 ? value : null;
  };

  function updateSummary() {
    const value = readQuantity();
    const valid = value !== null;
    quantity.setAttribute('aria-invalid', String(!valid));
    quantityError.hidden = valid;
    quantityError.textContent = valid ? '' : 'Escolha um número inteiro entre 1 e 20.';
    quantity.setCustomValidity(valid ? '' : quantityError.textContent);
    decrease.disabled = !valid || value === 1;
    increase.disabled = !valid || value === 20;
    document.getElementById('summary-quantity').textContent = valid ? String(value) : '—';
    document.getElementById('summary-unit').textContent = value === 1 ? 'IBIToken' : 'IBITokens';
    document.getElementById('summary-stays').textContent = valid ? `${value} ${value === 1 ? 'experiência' : 'experiências'}` : '— experiências';
    document.getElementById('total').textContent = valid ? money.format((value * unitPriceCents) / 100) : '—';
  }

  function showStep(step) {
    document.querySelectorAll('.purchase-panel').forEach(panel => {
      panel.hidden = panel.id !== `step-${step}`;
    });
    document.querySelectorAll('[data-step-label]').forEach(label => {
      if (label.dataset.stepLabel === String(step)) label.setAttribute('aria-current', 'step');
      else label.removeAttribute('aria-current');
    });
    const heading = document.querySelector(`#step-${step} h2`);
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start', behavior: 'auto' });
  }

  quantity.addEventListener('input', updateSummary);
  decrease.addEventListener('click', () => {
    const value = readQuantity();
    if (value !== null && value > 1) quantity.value = String(value - 1);
    updateSummary();
  });
  increase.addEventListener('click', () => {
    const value = readQuantity();
    if (value !== null && value < 20) quantity.value = String(value + 1);
    updateSummary();
  });
  document.getElementById('quantity-form').addEventListener('submit', event => {
    event.preventDefault();
    updateSummary();
    if (readQuantity() !== null && quantity.reportValidity()) showStep(2);
  });
  fullName.addEventListener('input', () => fullName.setCustomValidity(''));
  registrationForm.addEventListener('submit', event => {
    event.preventDefault();
    fullName.setCustomValidity(fullName.value.trim().length >= 3 ? '' : 'Informe um nome fictício com pelo menos 3 caracteres.');
    if (!registrationForm.reportValidity()) return;
    document.getElementById('review-name').textContent = fullName.value.trim();
    document.getElementById('review-email').textContent = email.value.trim();
    const ownWallet = registrationForm.elements.journey.value === 'propria';
    document.getElementById('review-journey').textContent = ownWallet ? 'Minha própria carteira' : 'Com orientação da equipe';
    showStep(3);
  });
  document.querySelectorAll('[data-go-step]').forEach(button => {
    button.addEventListener('click', () => showStep(Number(button.dataset.goStep)));
  });
  document.getElementById('restart').addEventListener('click', () => {
    registrationForm.reset();
    fullName.setCustomValidity('');
    quantity.value = '1';
    ['review-name', 'review-email', 'review-journey'].forEach(id => {
      document.getElementById(id).textContent = '';
    });
    updateSummary();
    showStep(1);
  });
  updateSummary();
})();
