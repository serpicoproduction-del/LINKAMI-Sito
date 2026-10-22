'use strict';
const { verificaAcquisto } = require('../lib/stripe');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const paid = await verificaAcquisto(req.query.session_id);
    if (!paid) return res.status(403).send('Download disponibile solo dopo il pagamento.');

    const token = process.env.GITHUB_DOWNLOAD_TOKEN;
    const repo = process.env.GITHUB_PRIVATE_REPO;
    const assetId = process.env.GITHUB_ASSET_ID;
    if (!token || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo || '') ||
        !/^\d+$/.test(assetId || '')) {
      return res.status(503).send('Il download protetto non e ancora configurato.');
    }

    // L'asset deve essere in una RELEASE DI UN REPOSITORY PRIVATO.
    // Si usa il redirect temporaneo di GitHub, mai lo ZIP pubblico.
    const response = await fetch(
      'https://api.github.com/repos/' + repo + '/releases/assets/' + assetId,
      {
        redirect: 'manual',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/octet-stream',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'LINKAMI-Download'
        },
        signal: AbortSignal.timeout(12000)
      }
    );

    if (response.status !== 302) {
      return res.status(502).send('Archivio protetto temporaneamente non disponibile.');
    }
    const location = response.headers.get('location');
    const safeUrl = new URL(location);
    if (safeUrl.protocol !== 'https:' ||
      !safeUrl.hostname.endsWith('.githubusercontent.com')) {
      return res.status(502).send('Origine download non valida.');
    }
    return res.redirect(302, safeUrl.toString());
  } catch {
    return res.status(502).send('Impossibile verificare il download. Riprova.');
  }
};
