import { verificaAcquisto } from '../_lib/stripe.js';

export async function onRequestGet({ request, env }) {
  const headers = {
    'Cache-Control': 'private, no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff'
  };
  if (env.PAYMENTS_ENABLED !== 'true') {
    return new Response('Vendite non ancora attive.', { status: 503, headers });
  }
  const id = new URL(request.url).searchParams.get('session_id');
  try {
    const paid = await verificaAcquisto(id, env);
    if (!paid) return new Response('Download disponibile solo dopo il pagamento.', { status: 403, headers });
    const { GITHUB_DOWNLOAD_TOKEN: token, GITHUB_PRIVATE_REPO: repo, GITHUB_ASSET_ID: assetId } = env;
    if (!token || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo || '') ||
      !/^\d+$/.test(assetId || '')) {
      return new Response('Archivio privato non configurato.', { status: 503, headers });
    }
    const response = await fetch(
      'https://api.github.com/repos/' + repo + '/releases/assets/' + assetId,
      {
        redirect: 'manual',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/octet-stream',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'LINKAMI-Downloader'
        }
      }
    );
    if (response.status !== 302) {
      return new Response('Download momentaneamente non disponibile.', { status: 502, headers });
    }
    const location = response.headers.get('location');
    if (!location) throw new Error('MISSING_DOWNLOAD_LOCATION');
    const uri = new URL(location);
    if (uri.protocol !== 'https:' || !(uri.hostname === 'githubusercontent.com' ||
      uri.hostname.endsWith('.githubusercontent.com'))) {
      throw new Error('INVALID_DOWNLOAD_LOCATION');
    }
    return new Response(null, { status: 302, headers: { ...headers, Location: uri.toString() } });
  } catch {
    return new Response('Impossibile verificare il download. Riprova.', { status: 502, headers });
  }
}
