(function (root) {
  'use strict';
  function normalizeLesson(value, max) {
    var number = Number.parseInt(value, 10);
    return Number.isFinite(number) && number >= 1 && number <= max ? number : 1;
  }
  function scoreQuiz(questions, answers) {
    var score = 0, unanswered = 0;
    questions.forEach(function (question, index) {
      if (answers[index] === undefined || answers[index] === null) unanswered += 1;
      else if (Number(answers[index]) === question.answer) score += 1;
    });
    return { score: score, total: questions.length, unanswered: unanswered };
  }
  function bestScore(previous, current) {
    var oldValue = Number.parseInt(previous, 10);
    return Math.max(Number.isFinite(oldValue) ? oldValue : 0, current);
  }
  function answerLabel(question, index) {
    return String.fromCharCode(65 + index) + '. ' + question.options[index];
  }
  function feedbackFor(question, selectedAnswer) {
    var feedback = {
      type: 'unanswered',
      status: '○ Chưa trả lời',
      selected: 'Bạn chưa chọn đáp án cho câu này.',
      correct: 'Đáp án đúng: ' + answerLabel(question, question.answer) + '.',
      why: 'Vì sao: ' + question.explanation
    };
    if (selectedAnswer === question.answer) {
      feedback.type = 'correct';
      feedback.status = '✓ Chính xác';
      feedback.selected = 'Bạn chọn: ' + answerLabel(question, selectedAnswer) + ' — đây là đáp án đúng.';
    } else if (selectedAnswer !== undefined && selectedAnswer !== null) {
      feedback.type = 'wrong';
      feedback.status = '✕ Chưa đúng';
      feedback.selected = 'Bạn chọn: ' + answerLabel(question, selectedAnswer) + '. Lựa chọn này chưa phù hợp với khái niệm được hỏi.';
    }
    return feedback;
  }
  var api = { normalizeLesson: normalizeLesson, scoreQuiz: scoreQuiz, bestScore: bestScore, answerLabel: answerLabel, feedbackFor: feedbackFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.QuizUtils = api;
  if (typeof document === 'undefined') return;

  function init() {
    var data = root.QUIZ_DATA || {};
    var max = Object.keys(data).length || 13;
    var params = new URLSearchParams(location.search);
    var lessonNumber = normalizeLesson(params.get('lesson'), max);
    var quiz = data[lessonNumber];
    if (!quiz) return;

    var form = document.querySelector('#quiz-form');
    var questionsRoot = document.querySelector('#questions');
    var title = document.querySelector('#quiz-title');
    var lessonLink = document.querySelector('#lesson-link');
    var picker = document.querySelector('#lesson-picker');
    var status = document.querySelector('#status');
    var result = document.querySelector('#result');
    var scoreEl = document.querySelector('#score');
    var resultTitle = document.querySelector('#result-title');
    var resultMessage = document.querySelector('#result-message');
    var submit = document.querySelector('#submit');
    var retry = document.querySelector('#retry');
    var bestEl = document.querySelector('#best-score');
    var storageKey = 'c4e-quiz-best-' + lessonNumber;

    title.textContent = 'Lesson ' + lessonNumber + ' · ' + quiz.title;
    lessonLink.href = 'lessons/lesson-' + String(lessonNumber).padStart(2, '0') + '.html';
    for (var number = 1; number <= max; number += 1) {
      var link = document.createElement('a');
      link.href = 'quiz.html?lesson=' + number;
      link.textContent = number;
      link.setAttribute('aria-label', 'Quiz Lesson ' + number);
      if (number === lessonNumber) { link.className = 'active'; link.setAttribute('aria-current', 'page'); }
      picker.appendChild(link);
    }

    function getStoredBest() { try { return localStorage.getItem(storageKey); } catch (error) { return null; } }
    function setStoredBest(value) { try { localStorage.setItem(storageKey, String(value)); } catch (error) { /* Quiz still works without storage. */ } }
    function updateBest() {
      var value = getStoredBest();
      bestEl.textContent = 'Best score: ' + (value === null ? '—' : value + '/' + quiz.questions.length);
    }

    function render() {
      questionsRoot.textContent = '';
      quiz.questions.forEach(function (question, index) {
        var fieldset = document.createElement('fieldset');
        fieldset.className = 'question';
        var legend = document.createElement('legend');
        legend.innerHTML = '<span class="question-no">CÂU ' + String(index + 1).padStart(2, '0') + '</span><h2>' + question.text + '</h2>';
        fieldset.appendChild(legend);
        var options = document.createElement('div');
        options.className = 'options';
        question.options.forEach(function (option, optionIndex) {
          var label = document.createElement('label');
          label.className = 'option';
          var input = document.createElement('input');
          input.type = 'radio'; input.name = 'question-' + index; input.value = String(optionIndex);
          var letter = document.createElement('b');
          letter.textContent = String.fromCharCode(65 + optionIndex) + '.';
          var text = document.createElement('span');
          text.textContent = option;
          label.append(input, letter, text);
          options.appendChild(label);
        });
        var explanation = document.createElement('div');
        explanation.className = 'explanation';
        explanation.setAttribute('aria-live', 'polite');
        explanation.innerHTML = '<strong class="answer-status"></strong><div class="answer-choice"></div><div class="correct-choice"></div><p class="why"></p>';
        fieldset.append(options, explanation);
        questionsRoot.appendChild(fieldset);
      });
      form.classList.remove('submitted');
      result.classList.remove('show');
      submit.style.display = 'inline-block';
      retry.style.display = 'none';
      updateStatus();
    }

    function readAnswers() {
      return quiz.questions.map(function (_, index) {
        var selected = form.querySelector('input[name="question-' + index + '"]:checked');
        return selected ? Number(selected.value) : undefined;
      });
    }
    function updateStatus() {
      var answered = readAnswers().filter(function (value) { return value !== undefined; }).length;
      status.textContent = 'Đã trả lời ' + answered + '/' + quiz.questions.length + ' câu';
    }
    form.addEventListener('change', updateStatus);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var answers = readAnswers();
      var scored = scoreQuiz(quiz.questions, answers);
      form.classList.add('submitted');
      quiz.questions.forEach(function (question, index) {
        var fieldset = questionsRoot.children[index];
        var selectedAnswer = answers[index];
        var explanation = fieldset.querySelector('.explanation');
        var answerStatus = explanation.querySelector('.answer-status');
        var answerChoice = explanation.querySelector('.answer-choice');
        var correctChoice = explanation.querySelector('.correct-choice');
        var why = explanation.querySelector('.why');

        fieldset.querySelectorAll('.option').forEach(function (label, optionIndex) {
          if (optionIndex === question.answer) label.classList.add('correct');
          if (selectedAnswer === optionIndex && optionIndex !== question.answer) label.classList.add('wrong');
          label.querySelector('input').disabled = true;
        });

        var feedback = feedbackFor(question, selectedAnswer);
        fieldset.classList.add('result-' + feedback.type);
        answerStatus.textContent = feedback.status;
        answerChoice.textContent = feedback.selected;
        correctChoice.textContent = feedback.correct;
        why.textContent = feedback.why;
      });

      var best = bestScore(getStoredBest(), scored.score);
      setStoredBest(best); updateBest();
      scoreEl.textContent = scored.score + '/' + scored.total;
      var ratio = scored.score / scored.total;
      if (ratio === 1) {
        resultTitle.textContent = 'Xuất sắc — hiểu rất chắc!';
        resultMessage.textContent = 'Hãy thử giải thích lại từng đáp án cho một người khác.';
      } else if (ratio >= 0.67) {
        resultTitle.textContent = 'Tốt — xem lại vài điểm nhỏ.';
        resultMessage.textContent = 'Đọc phần “Vì sao” ở những câu sai rồi quay lại slide liên quan.';
      } else {
        resultTitle.textContent = 'Cần ôn lại phần cốt lõi.';
        resultMessage.textContent = 'Không sao: xem đáp án đúng, đọc lý do, quay lại live demo và thử lần nữa.';
      }
      if (scored.unanswered) resultMessage.textContent += ' Bạn bỏ trống ' + scored.unanswered + ' câu.';
      result.classList.add('show');
      submit.style.display = 'none'; retry.style.display = 'inline-block';
      status.textContent = 'Đã nộp · ' + scored.score + '/' + scored.total;
      result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    retry.addEventListener('click', function () { render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    render(); updateBest();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(typeof globalThis !== 'undefined' ? globalThis : this);
