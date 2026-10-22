/* LINKAMI — Powered by Serpico Production
   Il pulsante Scarica apre il pagamento Stripe, non il vecchio ZIP pubblico.
   La consegna del file passa dalla verifica server-side del pagamento.
*/
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const isLocalPreview = window.location.protocol === 'file:';
const stripePaymentUrl = 'https://buy.stripe.com/5kQdR8fA4fHxgkufeU3oA00';

document.querySelectorAll('[data-download]').forEach(link => {
  link.setAttribute('href', isLocalPreview ? stripePaymentUrl : '/scarica');
  link.removeAttribute('target');
  link.setAttribute('aria-label', 'Acquista LINKAMI 1.0 per 2,99 euro con Stripe');
});
