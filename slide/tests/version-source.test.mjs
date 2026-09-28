import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const source = require('../capstone/versions/version-source.js');

test('all 13 versions expose non-empty HTML CSS and JavaScript sources', () => {
  for (let version = 1; version <= 13; version += 1) {
    const files = source.getSources(version, '<main id="store"><h1>TechStore</h1></main>');
    assert.ok(files.html.includes(`Version ${String(version).padStart(2, '0')}`));
    assert.ok(files.css.trim().length > 50);
    assert.ok(files.js.trim().length > 10);
    assert.doesNotThrow(() => new Function(files.js), `Version ${version} script.js must parse`);
  }
});

test('source code grows with the relevant course milestones', () => {
  assert.ok(!source.buildCss(1).includes('--brand'));
  assert.ok(source.buildCss(2).includes('--brand'));
  assert.ok(source.buildCss(4).includes('grid-template-columns'));
  assert.ok(source.buildCss(5).includes('@media'));
  assert.ok(source.buildJs(7).includes('stockLabel'));
  assert.ok(source.buildJs(11).includes('getVisibleProducts'));
  assert.ok(source.buildJs(12).includes('addToCart'));
  assert.ok(source.buildJs(13).includes('GitHub Pages'));
});

test('HTML source wraps the rendered version UI as a complete document', () => {
  const html = source.buildHtml(6, '<main id="store">Catalog</main>');
  assert.match(html, /^<!doctype html>/);
  assert.ok(html.includes('<link rel="stylesheet" href="style.css">'));
  assert.ok(html.includes('<script src="script.js"><\/script>'));
});
