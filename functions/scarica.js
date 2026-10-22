// Solo anteprima Stripe Sandbox: mai inoltrare i visitatori al link live.
export async function onRequestGet({ env }) {
  const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' };
  if (env.PAYMENTS_ENABLED !== 'true' || env.STRIPE_TEST_MODE !== 'true') {
    return new Response('Acquisti di prova non ancora attivi.', { status: 503, headers });
  }
  const url = env.STRIPE_TEST_PAYMENT_LINK_URL || '';
  if (!/^https:\/\/buy\.stripe\.com\/test_[A-Za-z0-9]+$/.test(url)) {
    return new Response('Link di prova Stripe non configurato.', { status: 503, headers });
  }
  return Response.redirect(url, 302);
}
