export async function onRequestGet({ env }) {
  if (env.PAYMENTS_ENABLED !== 'true') {
    return new Response(
      '<!doctype html><html lang="it"><meta charset="utf-8"><title>LINKAMI</title><body style="font:16px system-ui;background:#080e15;color:white;text-align:center;padding:10vh 20px"><h1>LINKAMI</h1><p>Acquisti non ancora attivi.</p><a style="color:#5fd9d0" href="/">Torna al sito</a></body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control':'no-store' } }
    );
  }
  return Response.redirect('https://buy.stripe.com/5kQdR8fA4fHxgkufeU3oA00', 302);
}
