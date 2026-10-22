# LINKAMI — Distribuzione a pagamento con Cloudflare Pages (bozza)

Questa variante usa la stessa landing, **senza cambiare design**, ma sposta le API
server-side su Cloudflare Pages Functions invece di Vercel Hobby (non commerciale).
La vendita resta disattivata fino a `PAYMENTS_ENABLED=true`.

## Creazione Cloudflare Pages
- Cloudflare Dashboard > Workers & Pages > Create > Pages > Import an existing Git repository.
- Repository: `serpicoproduction-del/LINKAMI-Sito`
- **Production branch:** `feature/cloudflare-checkout-free` (NON main, che serve il sito Vercel).
- Framework preset: None.
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- Functions sono riconosciute nella cartella `functions/`.
- Il dominio temporaneo sarà `*.pages.dev`.

## Variabili di produzione Cloudflare
Inserire dalle impostazioni del progetto Cloudflare (NON in chat):
- Secret `STRIPE_SECRET_KEY`: chiave LIVE Stripe restricted con Checkout Sessions Read
- Variable `STRIPE_PAYMENT_LINK_ID`: `plink_1UTH6fB87yxzBIj1noSipUtQ`
- Secret `GITHUB_DOWNLOAD_TOKEN`: token GitHub fine-grained con Contents Read-only per il repository privato
- Variable `GITHUB_PRIVATE_REPO`: `serpicoproduction-del/LINKAMI-Download-Privato`
- Variable `GITHUB_ASSET_ID`: `665183558`
- Variable `PAYMENTS_ENABLED`: `false` finché tutti i test non sono superati

## Altri passaggi PRIMA dell'abilitazione
1. Configurare il dominio `linkami.serpicoproduction.it` sul nuovo progetto Cloudflare,
   dopo aver verificato il progetto su `pages.dev` e pianificato il trasferimento dal vecchio Vercel.
2. Sul Payment Link Stripe, nella sezione **Dopo il pagamento**, aggiornare reindirizzamento:
   `https://linkami.serpicoproduction.it/grazie?session_id={CHECKOUT_SESSION_ID}`.
   **Non aggiornare prima** che il dominio Cloudflare e la pagina siano attivi.
3. Controllare che le 5 variabili siano valide (alcune erano state aggiunte soltanto a Vercel).
4. Eliminare la release ZIP pubblica del vecchio repository `LINKAMI-Download`, *dopo* essersi
   accertati che il file privato sia disponibile attraverso il nuovo sistema.
5. Fare un acquisto controllato reale di 2,99 € per verificare Stripe > /grazie > download 65.6 MB.
6. Verificare vendite, fiscalità e condizioni software con professionista competente.
7. Dopo i controlli, portare `PAYMENTS_ENABLED` a `true` e pubblicizzare il sito.

## Avvertenze
Il download è legato alla Checkout Session: chi riceve l'URL completo di sessione pagata potrebbe
riutilizzarlo. Il link temporaneo GitHub non richiede più il token lato browser.
Per un sistema con token monouso, limitazioni per email o controlli sui rimborsi sarà necessaria
una revisione successiva.
I token GitHub scadono e vanno rinnovati in tempo.
