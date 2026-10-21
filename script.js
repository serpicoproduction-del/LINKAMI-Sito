/* LINKAMI — Powered by Serpico Production
   I pulsanti Scarica avviano direttamente il download.
   Sul sito pubblicato, l'indirizzo /scarica rimanda al file ZIP della release.
   Con la pagina aperta dal computer (file://) il download funziona
   anche prima della pubblicazione.
*/
const LOCAL_PREVIEW_DOWNLOAD_URL = "https://github.com/serpicoproduction-del/LINKAMI-Download/releases/download/v1.0.0/LINKAMI_Windows_1.0.zip";

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const isLocalPreview = window.location.protocol === 'file:';
document.querySelectorAll('[data-download]').forEach(link => {
  link.setAttribute('href', isLocalPreview ? LOCAL_PREVIEW_DOWNLOAD_URL : '/scarica');
  link.removeAttribute('target');
  link.setAttribute('aria-label', 'Scarica LINKAMI 1.0 per Windows');
});
