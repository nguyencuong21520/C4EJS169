import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

for (let number = 1; number <= 13; number += 1) {
  const filename = `lessons/lesson-${String(number).padStart(2, '0')}.html`;
  const url = pathToFileURL(path.join(root, filename)).href;
  const result = spawnSync(chrome, ['--headless=new', '--disable-gpu', '--disable-background-networking', '--allow-file-access-from-files', '--dump-dom', url], { encoding: 'utf8', timeout: 20000, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(result.status, 0, `Chrome failed for ${filename}: ${result.stderr}`);
  const slideCount = (result.stdout.match(/<section class="slide/g) || []).length;
  assert.ok(slideCount >= 18, `${filename} rendered only ${slideCount} slides`);
  assert.ok(result.stdout.includes(`quiz.html?lesson=${number}`), `${filename} has no quiz link`);
  assert.ok(result.stdout.includes(`solutions/lesson-${String(number).padStart(2, '0')}.html`), `${filename} has no solution link`);
  console.log(`✓ Lesson ${String(number).padStart(2, '0')}: ${slideCount} slides, quiz + solution links`);
}
console.log('All 13 lesson decks rendered successfully.');
