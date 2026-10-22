import { verificaAcquisto } from '../_lib/stripe.js';

export async function onRequestGet({ request, env }) {
  const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
  if (env.PAYMENTS_ENABLED !== 'true') {
    return Response.json({ paid: false, error: 'Vendite non ancora attive.' }, { status: 503, headers });
  }
  const id = new URL(request.url).searchParams.get('session_id');
  try {
    const paid = await verificaAcquisto(id, env);
    return Response.json({ paid }, { status: 200, headers });
  } catch {
    return Response.json({ paid: false, error: 'Verifica temporaneamente non disponibile.' }, { status: 502, headers });
  }
}
