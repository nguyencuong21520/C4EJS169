import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function render(relative, query = '', windowSize = '1366,768') {
  const url = pathToFileURL(path.join(root, relative)).href + query;
  const result = spawnSync(chrome, [
    '--headless=new', '--disable-gpu', '--disable-dev-shm-usage', '--disable-background-networking',
    '--no-first-run', '--no-default-browser-check', '--allow-file-access-from-files',
    `--window-size=${windowSize}`, '--dump-dom', url
  ], { encoding: 'utf8', timeout: 20000, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(result.status, 0, `Chrome failed for ${relative}: ${result.stderr}`);
  assert.ok(result.stdout.includes('<html'), `${relative} returned no DOM`);
  assert.ok(!/Uncaught|ReferenceError|SyntaxError/.test(result.stderr), `${relative} logged a runtime error: ${result.stderr}`);
  return result.stdout;
}

test('catalog renders all 13 lesson links', () => {
  const dom = render('index.html');
  assert.equal((dom.match(/href="lessons\/lesson-\d{2}\.html"/g) || []).length, 13);
});

test('all lesson decks render slides, one active slide and a live demo', () => {
  for (let number = 1; number <= 13; number += 1) {
    const filename = `lessons/lesson-${String(number).padStart(2, '0')}.html`;
    const dom = render(filename);
    const slideCount = (dom.match(/<section class="slide/g) || []).length;
    const activeCount = (dom.match(/<section class="slide[^"]* active/g) || []).length;
    assert.ok(slideCount >= 18, `${filename} rendered only ${slideCount} slides`);
    assert.equal(activeCount, 1, `${filename} must have exactly one active slide`);
    assert.ok(dom.includes('class="demo'), `${filename} did not build its live demo iframe`);
    assert.ok(dom.includes(`quiz.html?lesson=${number}`), `${filename} does not link its quiz`);
    assert.ok(dom.includes(`solutions/lesson-${String(number).padStart(2, '0')}.html`), `${filename} does not link its solution`);
    assert.ok(dom.includes('Bài tập 1 · Project xuyên suốt khóa học'), `${filename} does not clearly label the continuous project as Assignment 1`);
    assert.ok(dom.includes('Bài tập 2 · Mini Project'), `${filename} does not clearly label its Mini Project as Assignment 2`);
    assert.ok(dom.includes(`capstone/index.html#lesson-${number}`), `${filename} does not link its capstone checkpoint`);
    assert.ok(dom.includes(`capstone/versions/lesson-${String(number).padStart(2, '0')}.html`), `${filename} does not link its runnable TechStore version`);
    assert.ok(dom.includes(`cheatsheet.html?lesson=${number}`), `${filename} does not link its Cheat Sheet`);
    assert.ok(dom.includes('aria-label="Mở mục lục slide"'), `${filename} menu has no accessible name`);
    assert.ok(dom.includes('aria-label="Slide trước"') && dom.includes('aria-label="Slide sau"'), `${filename} navigation has no accessible names`);
    assert.ok(!dom.includes('<span <span'), `${filename} syntax highlighting produced malformed markup`);
  }
});

test('responsive lesson shell still renders at mobile viewport', () => {
  const dom = render('lessons/lesson-05.html', '#8', '375,812');
  assert.ok(dom.includes('class="slide slide--light active"') || dom.includes(' active"'));
  assert.ok(dom.includes('Responsive, Tailwind &amp; AI'));
});

test('quiz hub renders eight questions and thirteen lesson selectors', () => {
  const dom = render('quiz.html', '?lesson=12');
  assert.equal((dom.match(/<fieldset class="question"/g) || []).length, 8);
  assert.equal((dom.match(/aria-label="Quiz Lesson /g) || []).length, 13);
  assert.ok(dom.includes('Lesson 12 · DOM &amp; Events'));
});

test('wide projector viewport renders the final lesson', () => {
  const dom = render('lessons/lesson-13.html', '#1', '1920,1080');
  assert.ok(dom.includes('Git &amp; Deployment'));
  assert.equal((dom.match(/<section class="slide[^"]* active/g) || []).length, 1);
});

test('solution hub and all 13 solution pages render reference content', () => {
  const hub = render('solutions/index.html');
  assert.equal((hub.match(/href="lesson-\d{2}\.html"/g) || []).length, 13);
  for (let number = 1; number <= 13; number += 1) {
    const filename = `solutions/lesson-${String(number).padStart(2, '0')}.html`;
    const dom = render(filename);
    assert.ok(dom.includes('Reference solution'), `${filename} did not render solution content`);
    assert.ok(dom.includes('Back to Index'), `${filename} has no Back to Index`);
    assert.ok(dom.includes('Checklist tự chấm'), `${filename} has no checklist`);
    if (number < 13) assert.ok(dom.includes('<iframe'), `${filename} has no live preview`);
    else assert.ok(dom.includes('git status'), `${filename} has no Git runbook`);
  }
});

test('Cheat Sheet page renders condensed content for different lessons', () => {
  for (const number of [1, 6, 13]) {
    const dom = render('cheatsheet.html', `?lesson=${number}`);
    assert.equal((dom.match(/<tr>/g) || []).length, 6, `Cheat Sheet ${number} needs header + 5 rows`);
    assert.ok(dom.includes(`Lesson ${number} ·`));
    assert.ok(dom.includes('Checklist trước khi nộp'));
    assert.ok(dom.includes('Bẫy thường gặp'));
  }
});

test('solution code blocks are visually formatted with line breaks', () => {
  const dom = render('solutions/lesson-02.html');
  assert.match(dom, /<code class="language-css">:root \{\n\s+<span class="tok-property">--brand<\/span>/);
  assert.ok(dom.includes('.course-card {\n'));
  assert.ok(dom.includes('tok-property'));
  assert.ok(dom.includes('tok-number'));
});

test('TechStore project hub, starter and final ecommerce render', () => {
  const hub = render('capstone/index.html');
  assert.equal((hub.match(/class="milestone"/g) || []).length, 13);
  assert.ok(hub.includes('Bài tập 1 · Project xuyên suốt'));
  assert.ok(hub.includes('TechStore'));
  assert.ok(hub.includes('versions/lesson-01.html'));
  assert.ok(hub.includes('starter/index.html'));
  assert.ok(hub.includes('reference/index.html'));

  const starter = render('capstone/starter/index.html');
  assert.ok(starter.includes('TECH / STORE'));
  assert.ok(starter.includes('Nova Keyboard'));
  assert.ok(starter.includes('Project roadmap'));

  const reference = render('capstone/reference/index.html');
  assert.ok(reference.includes('Nova Keyboard'));
  assert.ok(reference.includes('Pulse Headphones'));
  assert.ok(reference.includes('6 sản phẩm'));
  assert.ok(reference.includes('Giỏ hàng'));
});

test('TechStore versions show cumulative progress from lesson 1 to 13', () => {
  const versionIndex = render('capstone/versions/index.html');
  assert.equal((versionIndex.match(/class="milestone"/g) || []).length, 13);
  for (let number = 1; number <= 13; number += 1) {
    const dom = render(`capstone/versions/lesson-${String(number).padStart(2, '0')}.html`);
    assert.ok(dom.includes(`Version ${String(number).padStart(2, '0')} ·`));
    assert.equal((dom.match(/<li/g) || []).length >= 16, true);
    assert.ok(dom.includes('TECH / STORE'));
    assert.ok(dom.includes('tok-'));
    assert.ok(dom.includes('Xem full code'), `Version ${number} has no code viewer button`);
    assert.equal((dom.match(/role="tab"/g) || []).length, 3, `Version ${number} needs three file tabs`);
    assert.ok(dom.includes('copy-version-code'), `Version ${number} has no copy button`);
    assert.ok(dom.includes('language-html'), `Version ${number} does not render its HTML source`);
  }
  const cartVersion = render('capstone/versions/lesson-12.html');
  assert.ok(cartVersion.includes('Thêm vào giỏ'));
  const deployed = render('capstone/versions/lesson-13.html');
  assert.ok(deployed.includes('TechStore is live on GitHub Pages'));
});
