'use strict';
const { verificaAcquisto } = require('../lib/stripe');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') return res.status(405).json({ paid: false });

  try {
    const paid = await verificaAcquisto(req.query.session_id);
    return res.status(200).json({ paid });
  } catch (error) {
    const missingConfig = error.message === 'CONFIGURAZIONE_PAGAMENTO_MANCANTE';
    return res.status(missingConfig ? 503 : 502).json({
      paid: false,
      error: 'Verifica temporaneamente non disponibile.'
    });
  }
};
