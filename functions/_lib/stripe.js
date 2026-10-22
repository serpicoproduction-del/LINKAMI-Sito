export async function verificaAcquisto(id, env) {
  if (typeof id !== 'string' || !/^cs_live_[a-zA-Z0-9]+$/.test(id)) return false;
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PAYMENT_LINK_ID) {
    throw new Error('MISSING_PAYMENT_CONFIG');
  }
  const response = await fetch('https://api.stripe.com/v1/checkout/sessions/' + encodeURIComponent(id), {
    headers: { Authorization: 'Bearer ' + env.STRIPE_SECRET_KEY }
  });
  if (response.status === 404) return false;
  if (!response.ok) throw new Error('STRIPE_UNAVAILABLE');
  const session = await response.json();
  return session.status === 'complete' &&
    session.payment_status === 'paid' &&
    session.livemode === true &&
    session.mode === 'payment' &&
    session.currency === 'eur' &&
    session.amount_total === 299 &&
    session.payment_link === env.STRIPE_PAYMENT_LINK_ID;
}
