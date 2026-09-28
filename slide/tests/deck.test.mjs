import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const deck = require('../assets/deck.js');

test('clampSlide keeps slide index inside bounds', () => {
  assert.equal(deck.clampSlide(-4, 10), 0);
  assert.equal(deck.clampSlide(4, 10), 4);
  assert.equal(deck.clampSlide(99, 10), 9);
  assert.equal(deck.clampSlide(Number.NaN, 10), 0);
});

test('parseSlideHash converts one-based hash to zero-based index', () => {
  assert.equal(deck.parseSlideHash('#1', 20), 0);
  assert.equal(deck.parseSlideHash('#8', 20), 7);
  assert.equal(deck.parseSlideHash('#999', 20), 19);
  assert.equal(deck.parseSlideHash('#oops', 20), 0);
});

test('isInteractiveElement protects controls from slide shortcuts', () => {
  const makeTarget = selector => ({ closest: query => query.includes(selector) ? {} : null });
  assert.equal(deck.isInteractiveElement(makeTarget('textarea')), true);
  assert.equal(deck.isInteractiveElement(makeTarget('button')), true);
  assert.equal(deck.isInteractiveElement({ closest: () => null }), false);
  assert.equal(deck.isInteractiveElement(null), false);
});

test('escapeHtml neutralizes markup', () => {
  assert.equal(deck.escapeHtml('<script>"x"</script>'), '&lt;script&gt;&quot;x&quot;&lt;/script&gt;');
});

test('syntax highlighter colors tokens without rewriting generated markup', () => {
  const highlighted = deck.highlightSource('const message = "hello"; // note', 'js');
  assert.match(highlighted, /class="t-key">const<\/span>/);
  assert.match(highlighted, /class="t-str">&quot;hello&quot;<\/span>/);
  assert.match(highlighted, /class="t-com">\/\/ note<\/span>/);
  assert.doesNotMatch(highlighted, /<span\s+<span/);
  assert.equal((highlighted.match(/<span/g) || []).length, (highlighted.match(/<\/span>/g) || []).length);
});

test('swipe navigation ignores code, demos and form controls', () => {
  const makeTarget = selector => ({ closest: query => query.includes(selector) ? {} : null });
  assert.equal(deck.shouldIgnoreSwipe(makeTarget('pre')), true);
  assert.equal(deck.shouldIgnoreSwipe(makeTarget('iframe')), true);
  assert.equal(deck.shouldIgnoreSwipe(makeTarget('input')), true);
  assert.equal(deck.shouldIgnoreSwipe({ closest: () => null }), false);
});
