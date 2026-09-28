import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const quiz = require('../assets/quiz.js');

const questions = [
  { answer: 1 },
  { answer: 0 },
  { answer: 3 }
];

test('scoreQuiz scores correct, wrong and unanswered answers', () => {
  assert.deepEqual(quiz.scoreQuiz(questions, [1, 2, undefined]), { score: 1, total: 3, unanswered: 1 });
  assert.deepEqual(quiz.scoreQuiz(questions, [1, 0, 3]), { score: 3, total: 3, unanswered: 0 });
});

test('normalizeLesson accepts only course range', () => {
  assert.equal(quiz.normalizeLesson('5', 13), 5);
  assert.equal(quiz.normalizeLesson('0', 13), 1);
  assert.equal(quiz.normalizeLesson('14', 13), 1);
  assert.equal(quiz.normalizeLesson('abc', 13), 1);
});

test('bestScore never decreases and handles missing storage', () => {
  assert.equal(quiz.bestScore(null, 4), 4);
  assert.equal(quiz.bestScore('5', 3), 5);
  assert.equal(quiz.bestScore('2', 6), 6);
});

test('feedbackFor explains correct, wrong and unanswered results', () => {
  const question = { options: ['A sai', 'B đúng', 'C sai', 'D sai'], answer: 1, explanation: 'B phù hợp với định nghĩa.' };
  const correct = quiz.feedbackFor(question, 1);
  assert.equal(correct.type, 'correct');
  assert.match(correct.selected, /đáp án đúng/);
  assert.match(correct.why, /B phù hợp/);

  const wrong = quiz.feedbackFor(question, 0);
  assert.equal(wrong.type, 'wrong');
  assert.match(wrong.selected, /A\. A sai/);
  assert.match(wrong.correct, /B\. B đúng/);

  const unanswered = quiz.feedbackFor(question, undefined);
  assert.equal(unanswered.type, 'unanswered');
  assert.match(unanswered.selected, /chưa chọn/);
  assert.match(unanswered.correct, /B\. B đúng/);
});
