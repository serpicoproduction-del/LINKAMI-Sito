// Solo per la branch test/stripe-sandbox-download.
// La produzione continua a usare la verifica dei pagamenti live nella sua branch.
export async function verificaAcquisto(id, env) {
  // Non consentire mai sessioni reali in questa anteprima.
  if (env.STRIPE_TEST_MODE !== 'true') return false;
  if (typeof id !== 'string' || !/^cs_test_[a-zA-Z0-9]+$/.test(id)) return false;
  if (!env.STRIPE_SECRET_KEY || !/^(sk|rk)_test_/.test(env.STRIPE_SECRET_KEY)) {
    throw new Error('MISSING_TEST_STRIPE_KEY');
  }
  if (!env.STRIPE_PAYMENT_LINK_ID) throw new Error('MISSING_TEST_PAYMENT_LINK_ID');

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions/' + encodeURIComponent(id), {
    headers: { Authorization: 'Bearer ' + env.STRIPE_SECRET_KEY }
  });
  if (response.status === 404) return false;
  if (!response.ok) throw new Error('TEST_STRIPE_UNAVAILABLE');
  const session = await response.json();
  return session.status === 'complete' &&
    session.payment_status === 'paid' &&
    session.livemode === false &&
    session.mode === 'payment' &&
    session.currency === 'eur' &&
    session.amount_total === 299 &&
    session.payment_link === env.STRIPE_PAYMENT_LINK_ID;
}
