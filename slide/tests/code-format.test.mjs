import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const format = require('../assets/code-format.js');
const course = require('../assets/course-data.js');
require('../assets/solution-data.js');

test('formats one-line CSS into visual indented blocks', () => {
  const source = ':root{--brand:#ff6b35;}body{display:grid;place-items:center}.card{padding:20px;border-radius:22px}';
  const result = format.format(source, 'css');
  assert.ok(result.split('\n').length >= 9);
  assert.match(result, /:root \{\n  --brand:#ff6b35;/);
  assert.match(result, /\.card \{/);
});

test('formats one-line HTML into nested lines', () => {
  const result = format.format('<article><h1>Hello</h1><p>World</p></article>', 'html');
  assert.equal(result, '<article>\n  <h1>Hello</h1>\n  <p>World</p>\n</article>');
});

test('formats JavaScript without splitting semicolons inside for parentheses', () => {
  const result = format.format('for(let i=0;i<3;i++){console.log(i);}', 'js');
  assert.match(result, /for\(let i=0;i<3;i\+\+\) \{/);
  assert.match(result, /\n  console\.log\(i\);\n/);
});

test('real course-card solution no longer renders CSS as one long line', () => {
  const source = globalThis.SOLUTION_DATA[2].files.css;
  const result = format.format(source, 'css');
  assert.ok(result.split('\n').length > 20);
  assert.ok(Math.max(...result.split('\n').map(line => line.length)) < 120);
});

test('formatted JavaScript from every lesson and solution still parses', () => {
  for (const lesson of Object.values(course)) {
    if (lesson.demo.js) assert.doesNotThrow(() => new Function(format.format(lesson.demo.js, 'js')), `Lesson ${lesson.number} demo JS became invalid`);
  }
  for (const [number, solution] of Object.entries(globalThis.SOLUTION_DATA)) {
    if (solution.files.js) assert.doesNotThrow(() => new Function(format.format(solution.files.js, 'js')), `Solution ${number} JS became invalid`);
  }
});

test('syntax highlighter adds language-specific colors without corrupting code', () => {
  const html = format.highlight('<form id="shipping"><button>Tính</button></form>', 'html');
  assert.match(html, /tok-tag/);
  assert.match(html, /&lt;form id="shipping"&gt;/);

  const css = format.highlight('button { color: #ffffff; padding: 10px; }', 'css');
  assert.match(css, /tok-property">color/);
  assert.match(css, /tok-number">#ffffff/);

  const js = format.highlight('const total = 10; // amount', 'js');
  assert.match(js, /tok-keyword">const/);
  assert.match(js, /tok-number">10/);
  assert.match(js, /tok-comment">\/\/ amount/);
  assert.equal((js.match(/<span/g) || []).length, (js.match(/<\/span>/g) || []).length);
});
