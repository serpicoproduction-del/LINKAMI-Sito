import { cpSync, copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
for (const filename of ['index.html', 'grazie.html', 'styles.css', 'script.js']) {
  copyFileSync(filename, 'dist/' + filename);
}
for (const directory of ['assets', 'guida']) {
  cpSync(directory, 'dist/' + directory, { recursive: true });
}
// Never publish the repository source, API implementations, or server-side secrets.
console.log('LINKAMI: static distribution assembled in dist/');
