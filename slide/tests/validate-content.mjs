import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const course = require('../assets/course-data.js');
const capstoneVersions = require('../assets/capstone-data.js');
const quizzes = require('../assets/quiz-data.js');
require('../assets/quiz-extra-data.js');
require('../assets/solution-data.js');
const solutions = globalThis.SOLUTION_DATA;
const cheats = require('../assets/cheat-data.js');
const failures = [];
function check(condition, message) { try { assert.ok(condition, message); } catch (error) { failures.push(error.message); } }
async function exists(file) { try { await access(file); return true; } catch { return false; } }

check(Object.keys(course).length === 13, 'Course data must contain exactly 13 lessons');
check(Object.keys(capstoneVersions).length === 13, 'TechStore must contain exactly 13 cumulative versions');
check(Object.keys(quizzes).length === 13, 'Quiz data must contain exactly 13 lessons');
check(Object.keys(solutions || {}).length === 13, 'Solution data must contain exactly 13 lessons');
check(Object.keys(cheats || {}).length === 13, 'Cheat Sheet data must contain exactly 13 lessons');

for (let number = 1; number <= 13; number += 1) {
  const lesson = course[number];
  const quiz = quizzes[number];
  check(Boolean(lesson), `Missing course data for lesson ${number}`);
  check(lesson?.number === number, `Lesson ${number} has wrong number`);
  const capstoneVersion = capstoneVersions[number];
  check(Boolean(capstoneVersion), `Missing TechStore version ${number}`);
  check(capstoneVersion?.changes?.length === 3, `TechStore version ${number} needs exactly 3 cumulative changes`);
  check(Boolean(capstoneVersion?.code?.text), `TechStore version ${number} needs a code delta`);
  check(lesson?.capstone?.title === capstoneVersion?.title, `Lesson ${number} capstone must use TechStore version data`);
  check(lesson?.objectives?.length >= 4, `Lesson ${number} needs at least 4 objectives`);
  check(lesson?.concepts?.length >= 4, `Lesson ${number} needs at least 4 concepts`);
  check(Boolean(lesson?.demo?.html), `Lesson ${number} needs a live HTML demo`);
  check(lesson?.miniProject?.done?.length >= 3, `Lesson ${number} needs mini-project criteria`);
  check(lesson?.mistakes?.length >= 3, `Lesson ${number} needs a debug clinic`);
  check(lesson?.practice?.requirements?.length >= 4, `Lesson ${number} needs a UI challenge`);
  check(lesson?.homework?.required?.length >= 3, `Lesson ${number} needs homework`);
  check(quiz?.questions?.length === 8, `Lesson ${number} quiz must have exactly 8 questions`);
  const solution = solutions?.[number];
  check(Boolean(solution), `Missing solution data for lesson ${number}`);
  check(solution?.steps?.length >= 4, `Lesson ${number} solution needs at least 4 analysis steps`);
  check(solution?.checklist?.length >= 4, `Lesson ${number} solution needs a self-check checklist`);
  check(Boolean(solution?.files?.html || solution?.files?.terminal), `Lesson ${number} solution needs runnable code or terminal commands`);
  const cheat = cheats?.[number];
  check(Boolean(cheat), `Missing Cheat Sheet data for lesson ${number}`);
  check(cheat?.items?.length === 5, `Lesson ${number} Cheat Sheet needs exactly 5 condensed rows`);
  check(cheat?.checklist?.length >= 4, `Lesson ${number} Cheat Sheet needs a checklist`);
  check(Boolean(cheat?.trap), `Lesson ${number} Cheat Sheet needs a common trap`);
  quiz?.questions?.forEach((question, index) => {
    check(question.options.length === 4, `Lesson ${number} question ${index + 1} must have A/B/C/D`);
    check(question.answer >= 0 && question.answer < 4, `Lesson ${number} question ${index + 1} answer is invalid`);
    check(Boolean(question.explanation), `Lesson ${number} question ${index + 1} needs explanation`);
  });

  const filename = `lesson-${String(number).padStart(2, '0')}.html`;
  const lessonPath = path.join(root, 'lessons', filename);
  check(await exists(lessonPath), `Missing ${filename}`);
  if (await exists(lessonPath)) {
    const html = await readFile(lessonPath, 'utf8');
    check(/<html lang="vi">/.test(html), `${filename} must use lang=vi`);
    check(new RegExp(`data-lesson="${number}"`).test(html), `${filename} has wrong data-lesson`);
    check(/href="\.\.\/index\.html"/.test(html), `${filename} needs Back to Index`);
    check(/class="deck"/.test(html), `${filename} needs deck root`);
    check(/code-format\.js/.test(html) && /cheat-data\.js/.test(html) && /course-data\.js/.test(html) && /capstone-data\.js/.test(html) && /deck\.js/.test(html), `${filename} needs formatter, Cheat Sheet, TechStore version data and shared deck scripts`);
  }

  const solutionPath = path.join(root, 'solutions', filename);
  check(await exists(solutionPath), `Missing solutions/${filename}`);
  if (await exists(solutionPath)) {
    const html = await readFile(solutionPath, 'utf8');
    check(/<html lang="vi">/.test(html), `solutions/${filename} must use lang=vi`);
    check(new RegExp(`data-solution="${number}"`).test(html), `solutions/${filename} has wrong data-solution`);
    check(/code-format\.js/.test(html) && /solution-data\.js/.test(html) && /solution\.js/.test(html), `solutions/${filename} needs formatter and shared solution scripts`);
  }

  const versionPath = path.join(root, 'capstone', 'versions', filename);
  check(await exists(versionPath), `Missing TechStore version page ${filename}`);
  if (await exists(versionPath)) {
    const html = await readFile(versionPath, 'utf8');
    check(new RegExp(`data-version="${number}"`).test(html), `TechStore ${filename} has wrong data-version`);
    check(/code-format\.js/.test(html) && /capstone-data\.js/.test(html) && /version-source\.js/.test(html) && /version\.js/.test(html), `TechStore ${filename} needs code formatter, source generator and shared version scripts`);
  }
}

const indexHtml = await readFile(path.join(root, 'index.html'), 'utf8');
const deckSource = await readFile(path.join(root, 'assets', 'deck.js'), 'utf8');
const versionRuntime = await readFile(path.join(root, 'capstone', 'versions', 'version.js'), 'utf8');
check(versionRuntime.includes('Xem full code'), 'TechStore versions need a full-code viewer button');
check(versionRuntime.includes('data-lang="html"') && versionRuntime.includes('data-lang="css"') && versionRuntime.includes('data-lang="js"'), 'Code viewer needs HTML/CSS/JS tabs');
check(versionRuntime.includes('navigator.clipboard') && versionRuntime.includes("execCommand('copy')"), 'Code viewer needs clipboard and direct-file fallback copy');
check(deckSource.includes("../solutions/lesson-"), 'Lesson renderer must link each UI challenge to its solution');
const cardLinks = indexHtml.match(/href="lessons\/lesson-\d{2}\.html"/g) || [];
check(cardLinks.length === 13, 'Catalog must link exactly 13 lesson cards');
check(indexHtml.includes('solutions/index.html'), 'Catalog must link the solution hub');
check(indexHtml.includes('capstone/index.html'), 'Catalog must link Assignment 1 continuous project');
check(indexHtml.includes('cheatsheet.html'), 'Catalog must link the Cheat Sheet hub');
check(deckSource.includes('Bài tập 1 · Project xuyên suốt khóa học'), 'Lesson renderer must clearly label the continuous project as Assignment 1');
check(deckSource.includes('Bài tập 2 · Mini Project'), 'Lesson renderer must clearly label the Mini Project as Assignment 2');
check(deckSource.includes('../capstone/index.html#lesson-'), 'Lesson renderer must link each checkpoint to the capstone roadmap');
check(deckSource.includes('../capstone/versions/lesson-'), 'Lesson renderer must link each lesson to its runnable TechStore version');
check(deckSource.includes("../cheatsheet.html?lesson="), 'Lesson renderer must link the printable Cheat Sheet');
for (const relative of ['capstone/starter/README.md', 'capstone/starter/style.css', 'capstone/starter/script.js', 'capstone/reference/README.md', 'capstone/reference/style.css', 'capstone/reference/script.js', 'capstone/versions/index.html', 'capstone/versions/version.css', 'capstone/versions/version-source.js', 'capstone/versions/version.js']) {
  check(await exists(path.join(root, relative)), `Missing capstone deliverable: ${relative}`);
}
const solutionIndexHtml = await readFile(path.join(root, 'solutions', 'index.html'), 'utf8');
const solutionLinks = solutionIndexHtml.match(/href="lesson-\d{2}\.html"/g) || [];
check(solutionLinks.length === 13, 'Solution hub must link exactly 13 solution pages');
check(!course[14], 'Lesson 14 must not exist');
check(course[3].demo.html.includes('aria-labelledby'), 'Lesson 3 modal needs an accessible name');
check(course[3].demo.js.includes("event.key==='Escape'"), 'Lesson 3 modal needs Escape handling');
check(course[11].demo.html.includes('<label>'), 'Lesson 11 search controls need labels');
check(course[12].demo.html.includes('aria-pressed'), 'Lesson 12 filters need selected-state semantics');
check(course[12].demo.js.includes('setAttribute(\'aria-pressed\''), 'Lesson 12 filter state must update');
for (const lesson of Object.values(course)) {
  for (const concept of lesson.concepts) {
    check(!concept.snippet?.code?.includes('!important'), `Lesson ${lesson.number} solution snippets must not use !important`);
  }
}

const legacyPages = ['slide.html', 'cheatsheet-html-co-ban.html', 'vi-du-gioi-thieu-ban-than.html'];
for (const relative of legacyPages) {
  const html = await readFile(path.join(root, relative), 'utf8');
  check(/href="index\.html"/.test(html), `${relative} needs Back to Index`);
}

const htmlFiles = ['index.html', 'quiz.html', 'cheatsheet.html', 'teacher-guide.html', 'solutions/index.html', 'capstone/index.html', 'capstone/starter/index.html', 'capstone/reference/index.html', 'capstone/versions/index.html', ...Array.from({ length: 13 }, (_, i) => `lessons/lesson-${String(i + 1).padStart(2, '0')}.html`), ...Array.from({ length: 13 }, (_, i) => `solutions/lesson-${String(i + 1).padStart(2, '0')}.html`), ...Array.from({ length: 13 }, (_, i) => `capstone/versions/lesson-${String(i + 1).padStart(2, '0')}.html`)];
for (const relative of htmlFiles) {
  const file = path.join(root, relative);
  if (!(await exists(file))) { failures.push(`Missing page ${relative}`); continue; }
  const html = await readFile(file, 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  check(duplicateIds.length === 0, `${relative} has duplicate IDs: ${duplicateIds.join(', ')}`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1];
    if (/^(https?:|mailto:|tel:|#|data:|javascript:)/.test(raw)) continue;
    const clean = raw.split('?')[0].split('#')[0];
    if (!clean) continue;
    const target = path.resolve(path.dirname(file), clean);
    check(await exists(target), `${relative} has broken internal link: ${raw}`);
  }
}

if (failures.length) {
  console.error(`Validation failed with ${failures.length} issue(s):`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exitCode = 1;
} else {
  console.log('Content validation passed: TechStore starter/reference + 13 versions, 13 lessons, 13 Cheat Sheets, 13 solutions, 104 quiz questions, links and structure are valid.');
}
