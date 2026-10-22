# LINKAMI 1.0 — Acquisto Stripe + download protetto (bozza)

Queste modifiche **NON vanno pubblicate** prima di aver completato i passaggi sottostanti.

## 1. Stripe: link reale
Link creato: https://buy.stripe.com/5kQdR8fA4fHxgkufeU3oA00
Il pulsante esistente `/scarica` reindirizza a questo link.

## 2. Stripe: pagina dopo il pagamento
Nel link Stripe esistente, menu opzioni (•••) > Modifica link >
**Dopo il pagamento** > **Non mostrare la pagina di conferma (reindirizza al sito)**.
Inserire ESATTAMENTE:

https://linkami.serpicoproduction.it/grazie?session_id={CHECKOUT_SESSION_ID}

Usare il dominio effettivamente collegato a Vercel, se diverso da quello qui indicato.
Stripe sostituirà il segnaposto con l'ID della Checkout Session.

## 3. Archivio ZIP PRIVATO
Attualmente la release pubblica sul repository `LINKAMI-Download` permette
di ottenere lo ZIP senza pagare. Salvare una copia del file e caricarlo in una
GitHub Release di un repository **privato** separato, leggibile da un token
fine-grained con permesso Contents: read per il solo repository privato.
Una volta verificato che il download protetto funziona, **rimuovere il file
dalla release pubblica e qualsiasi URL pubblico alternativo**.

Per ZIP di grandi dimensioni, questo approccio usa un URL temporaneo
generato dall'API GitHub (HTTP 302): il server Vercel NON deve fare da proxy
al file, che supera i limiti tradizionali delle risposte non in streaming.

## 4. Vercel: variabili d'ambiente (SOLO server)
Nel progetto `linkami-sito`, Environment Variables, produzione:
- `STRIPE_SECRET_KEY`: chiave Stripe segreta LIVE, MAI nel repository.
- `STRIPE_PAYMENT_LINK_ID`: ID `plink_...` del link reale,
  visibile nella URL dettagli del link su Stripe.
- `GITHUB_DOWNLOAD_TOKEN`: token fine-grained privato, solo Contents read.
- `GITHUB_PRIVATE_REPO`: nel formato `owner/repository` del repository
  di download privato.
- `GITHUB_ASSET_ID`: identificatore numerico asset della nuova release privata.

Aggiungere i segreti nell'interfaccia Vercel; mai incollarli in chat o su GitHub.
Poi effettuare redeploy.

## 5. Prove prima della pubblicazione
- Testare che /scarica apra Stripe.
- Verificare che /grazie senza session_id NON offra download.
- Verificare che /api/download senza session_id risponda 403.
- Verificare che sessione non pagata NON autorizzi il download.
- Eseguire un pagamento reale di prova controllato, verificare /grazie,
  il download e il contenuto dello ZIP privato.
- Verificare ricevute, condizioni di vendita, IVA e politiche di rimborso.
- Solo dopo tutti i controlli, unire questa bozza nel branch main.

## 6. Limiti della prima versione
Il link di download appartiene alla sessione di pagamento: chi riceve un
session_id valido può riutilizzarlo. GitHub produce un redirect temporaneo.
Non sono ancora implementati invio email automatico, webhooks, gestione dei
rimborsi o download legati a un account utente.
