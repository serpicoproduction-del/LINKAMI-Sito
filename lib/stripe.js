'use strict';

// Controllo eseguito solo dal server. Non esporre mai STRIPE_SECRET_KEY nel browser.
async function verificaAcquisto(sessionId) {
  if (typeof sessionId !== 'string' || !/^cs_(?:live|test)_[a-zA-Z0-9]+$/.test(sessionId)) {
    return false;
  }
  const secret = process.env.STRIPE_SECRET_KEY;
  const paymentLinkId = process.env.STRIPE_PAYMENT_LINK_ID;
  if (!secret || !paymentLinkId) {
    throw new Error('CONFIGURAZIONE_PAGAMENTO_MANCANTE');
  }
  const response = await fetch(
    'https://api.stripe.com/v1/checkout/sessions/' + encodeURIComponent(sessionId),
    {
      headers: { Authorization: 'Bearer ' + secret },
      signal: AbortSignal.timeout(12000)
    }
  );
  if (response.status === 404) return false;
  if (!response.ok) throw new Error('VERIFICA_STRIPE_NON_DISPONIBILE');
  const session = await response.json();
  return session.status === 'complete' &&
    session.payment_status === 'paid' &&
    session.livemode === true &&
    session.mode === 'payment' &&
    session.currency === 'eur' &&
    session.amount_total === 299 &&
    session.payment_link === paymentLinkId;
}

module.exports = { verificaAcquisto };
