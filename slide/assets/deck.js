(function (root) {
  'use strict';

  function clampSlide(index, total) {
    if (!Number.isFinite(index) || total < 1) return 0;
    return Math.max(0, Math.min(total - 1, index));
  }

  function parseSlideHash(hash, total) {
    var parsed = Number.parseInt(String(hash || '').replace('#', ''), 10);
    return clampSlide(Number.isNaN(parsed) ? 0 : parsed - 1, total);
  }

  function isInteractiveElement(target) {
    if (!target || !target.closest) return false;
    return Boolean(target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="button"]'));
  }

  function shouldIgnoreSwipe(target) {
    if (!target || !target.closest) return false;
    return Boolean(target.closest('pre, .codewrap, .demo, iframe, input, textarea, select, button, a, [contenteditable="true"]'));
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function list(items, ordered) {
    var tag = ordered ? 'ol' : 'ul';
    return '<' + tag + '>' + items.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</' + tag + '>';
  }

  function codeBlock(language, code, label) {
    var formatted = root.CodeFormat ? root.CodeFormat.format(code, language) : code;
    return '<div class="codewrap"><div class="label"><span>' + escapeHtml(label || language) + '</span><span>' + escapeHtml(language.toUpperCase()) + '</span></div><pre><code data-lang="' + escapeHtml(language) + '">' + escapeHtml(formatted) + '</code></pre></div>';
  }

  function section(chapter, className, body, level) {
    return '<section class="slide ' + (className || '') + '" data-chapter="' + escapeHtml(chapter) + '"' + (level ? ' data-level="' + level + '"' : '') + '><div class="inner">' + body + '</div></section>';
  }

  function renderCourse(lesson) {
    var deck = document.querySelector('.deck');
    if (!deck || !lesson) return;
    document.title = 'Lesson ' + lesson.number + ' · ' + lesson.title + ' · C4E';
    document.documentElement.style.setProperty('--lesson-accent', lesson.accent || '#ff6b35');

    var html = '';
    html += section('Khởi động', 'slide--title',
      '<span class="badge badge--core">Cốt lõi · 60 phút</span>' +
      '<div class="eyebrow">Lesson ' + String(lesson.number).padStart(2, '0') + ' · ' + escapeHtml(lesson.track) + '</div>' +
      '<h1>' + escapeHtml(lesson.title) + '</h1>' +
      '<p class="sub">' + lesson.subtitle + '</p>' +
      '<p class="meta"><kbd>→</kbd> tiếp · <kbd>←</kbd> lùi · <kbd>O</kbd> mục lục · <kbd>F</kbd> toàn màn hình · vuốt trên điện thoại</p>');

    html += section('Khởi động', 'slide--light',
      '<span class="badge badge--core">Mục tiêu</span><h2>Sau buổi này, bạn làm được gì?</h2><p class="lead">Đầu ra quan sát được — không chỉ “đã nghe qua”.</p>' +
      '<div class="grid grid-2">' + lesson.objectives.map(function (item, index) {
        return '<div class="card accent" style="--accent:' + escapeHtml(lesson.accent) + '"><div class="stat">0' + (index + 1) + '</div><p>' + item + '</p></div>';
      }).join('') + '</div><div class="note note--tip"><b>Nhịp 60 phút:</b> 5′ khởi động · 25′ kiến thức/demo · 20′ code-along · 7′ quiz · 3′ tổng kết. Slide “Mở rộng” có thể giao tự đọc.</div>', 'core');

    html += section('Khởi động', '',
      '<span class="badge badge--core">Khởi động</span><h2>' + lesson.warmup.title + '</h2><p class="lead">' + lesson.warmup.prompt + '</p>' +
      '<div class="diagram">' + lesson.warmup.steps.map(function (step, index) {
        return (index ? '<span class="connector">→</span>' : '') + '<div class="node"><b>' + step.title + '</b><br><small>' + step.text + '</small></div>';
      }).join('') + '</div><div class="note"><b>Think–Pair–Share:</b> nghĩ 30 giây → trao đổi với bạn bên cạnh → một nhóm chia sẻ cách hiểu.</div>', 'core');

    lesson.concepts.forEach(function (concept, index) {
      var level = concept.level || 'core';
      var conceptBody = '<span class="badge ' + (level === 'extend' ? 'badge--extend' : 'badge--core') + '">' + (level === 'extend' ? 'Mở rộng' : 'Cốt lõi') + '</span>' +
        '<span class="eyebrow">Khái niệm ' + (index + 1) + '</span><h2>' + concept.title + '</h2><p class="lead">' + concept.summary + '</p>';
      if (concept.cards) {
        conceptBody += '<div class="grid grid-' + Math.min(concept.cards.length, 4) + '">' + concept.cards.map(function (card) {
          return '<div class="card accent" style="--accent:' + (card.color || lesson.accent) + '">' + (card.icon ? '<div class="icon">' + card.icon + '</div>' : '') + '<h3>' + card.title + '</h3><p>' + card.text + '</p></div>';
        }).join('') + '</div>';
      }
      if (concept.points) conceptBody += '<div class="grid grid-2"><div>' + list(concept.points, false) + '</div>' + (concept.snippet ? codeBlock(concept.snippet.lang, concept.snippet.code, concept.snippet.label) : '<div class="note">' + concept.note + '</div>') + '</div>';
      else if (concept.snippet) conceptBody += codeBlock(concept.snippet.lang, concept.snippet.code, concept.snippet.label);
      if (concept.note && concept.points) conceptBody += '<div class="note ' + (concept.warning ? 'note--warn' : 'note--tip') + '">' + concept.note + '</div>';
      html += section(concept.chapter || 'Kiến thức', index % 3 === 1 ? 'slide--light' : '', conceptBody, level);
    });

    if (lesson.visual) {
      html += section('Mô hình', 'slide--light',
        '<span class="badge badge--core">Sơ đồ trực quan</span><h2>' + lesson.visual.title + '</h2><p class="lead">' + lesson.visual.lead + '</p><div class="diagram">' + lesson.visual.nodes.map(function (node, index) {
          return (index ? '<span class="connector">' + (lesson.visual.connector || '→') + '</span>' : '') + '<div class="node"><div class="icon">' + (node.icon || '') + '</div><b>' + node.title + '</b><br><small>' + node.text + '</small></div>';
        }).join('') + '</div><div class="note note--tip">' + lesson.visual.takeaway + '</div>', 'core');
    }

    var demoCodes = '';
    ['html', 'css', 'js'].forEach(function (lang) {
      if (lesson.demo[lang]) demoCodes += codeBlock(lang, lesson.demo[lang], lang === 'js' ? 'script.js' : lang === 'css' ? 'style.css' : 'index.html');
    });
    html += section('Live demo', '',
      '<span class="badge badge--core">Live demo</span><h2>' + lesson.demo.title + '</h2><p class="lead">' + lesson.demo.lead + '</p>' +
      '<div class="example" data-run data-size="' + (lesson.demo.size || 'tall') + '"><div class="codes">' + demoCodes + '</div></div>' +
      '<div class="note"><b>Quan sát:</b> ' + lesson.demo.observe + '</div>', 'core');

    html += section('Thực hành', 'slide--section',
      '<div class="kicker">PHẦN THỰC HÀNH</div><h1>Hai đầu ra sau buổi học</h1><p><b>Bài tập 1</b> tiếp tục TechStore Ecommerce xuyên suốt 13 bài. <b>Bài tập 2</b> là Mini Project độc lập để luyện kiến thức vừa học.</p>' +
      '<div class="grid grid-2 practice-map"><div class="card accent" style="--accent:var(--green)"><div class="stat">01</div><h3>Project xuyên suốt · ' + escapeHtml(lesson.capstone.title) + '</h3><p>Mở cùng một project, hoàn thành checkpoint và commit tiến độ.</p></div><div class="card accent" style="--accent:' + lesson.accent + '"><div class="stat">02</div><h3>Mini Project · ' + escapeHtml(lesson.miniProject.title) + '</h3><p>Luyện đúng kiến thức buổi học bằng một UI nhỏ hoàn chỉnh.</p></div></div>', 'core');

    html += section('Thực hành · Project xuyên suốt', '',
      '<span class="badge badge--project">Bài tập 1 · Project xuyên suốt khóa học</span><h2>TechStore Ecommerce · Version ' + String(lesson.number).padStart(2, '0') + '</h2><p class="lead"><b>' + lesson.capstone.title + '</b> — tiếp tục trên cùng folder/repository từ buổi trước; không tạo project mới.</p>' +
      '<div class="grid grid-2"><div class="card accent" style="--accent:' + lesson.accent + '"><div class="eyebrow">Trạng thái đầu buổi</div><h3>Before</h3><p>' + lesson.capstone.before + '</p></div><div class="card accent" style="--accent:var(--green)"><div class="eyebrow">Sản phẩm cần nộp</div><h3>After</h3><p>' + lesson.capstone.after + '</p></div></div><div class="note note--tip"><b>Commit checkpoint:</b> <code class="inline">' + escapeHtml(lesson.capstone.commit) + '</code></div><div class="capstone-actions"><a class="solution-link" href="../capstone/versions/lesson-' + String(lesson.number).padStart(2, '0') + '.html">Xem TechStore Version ' + String(lesson.number).padStart(2, '0') + ' →</a><a class="solution-link" href="../capstone/index.html#lesson-' + lesson.number + '">Roadmap 13 versions</a><a class="solution-link" href="../capstone/starter/index.html">Mở bộ Starter</a></div>', 'core');

    html += section('Thực hành · Mini Project', '',
      '<span class="badge badge--project">Bài tập 2 · Mini Project</span><h2>' + lesson.miniProject.title + '</h2><p class="lead">' + lesson.miniProject.story + '</p>' +
      '<div class="grid grid-2"><div class="task"><h3>Definition of Done</h3>' + list(lesson.miniProject.done, true) + '<div class="note"><b>Thời gian:</b> ' + lesson.practice.minutes + ' phút · Làm độc lập trước, hỏi gợi ý sau.</div></div><div class="browser"><div class="browser-bar"><i></i><i></i><i></i><span class="browser-url">Mini Project · UI mục tiêu</span></div><div class="browser-body">' + lesson.miniProject.mock + '</div></div></div>', 'core');

    html += section('Thực hành · Mini Project', '',
      '<span class="badge badge--core">Code-along · Mini Project</span><h2>Triển khai · ' + lesson.practice.title + '</h2><p class="lead">' + lesson.practice.brief + '</p>' +
      '<div class="ui-brief"><div class="task"><h3>Yêu cầu code bắt buộc</h3><ul class="checklist">' + lesson.practice.requirements.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul><div class="note note--tip"><b>Nâng cao:</b> ' + lesson.practice.stretch + '</div><a class="solution-link" href="../solutions/lesson-' + String(lesson.number).padStart(2, '0') + '.html">Tự làm xong mới xem lời giải Mini Project →</a></div><div class="browser"><div class="browser-bar"><i></i><i></i><i></i><span class="browser-url">UI reference · phân tích rồi code lại</span></div><div class="browser-body">' + lesson.practice.mock + '</div></div></div>', 'core');

    html += section('Debug', 'slide--light',
      '<span class="badge badge--core">Debug clinic</span><h2>Lỗi thường gặp &amp; cách lần ra</h2><table class="mistakes"><thead><tr><th>Hiện tượng</th><th>Nguyên nhân</th><th>Cách kiểm tra</th></tr></thead><tbody>' + lesson.mistakes.map(function (row) {
        return '<tr><td><b>' + row.symptom + '</b></td><td>' + row.cause + '</td><td>' + row.fix + '</td></tr>';
      }).join('') + '</tbody></table><div class="note note--warn"><b>Quy trình 4 bước:</b> tái hiện lỗi → đọc thông báo → thu nhỏ vùng nghi ngờ → sửa một thay đổi rồi thử lại.</div>', 'core');

    html += section('Kiểm tra', 'slide--light',
      '<span class="badge badge--core">Kiểm tra nhanh</span><h2>8 câu · tự chấm · giải thích đúng/sai</h2><div class="quiz-teaser"><div><h3>Bạn đã sẵn sàng?</h3><p class="lead">Làm một lượt không xem tài liệu. Sau khi nộp, đọc giải thích cả câu đúng lẫn câu sai.</p></div><a class="cta" href="../quiz.html?lesson=' + lesson.number + '">Mở quiz Lesson ' + lesson.number + ' →</a></div><div class="note"><b>Exit ticket:</b> viết một điều bạn đã hiểu, một điều còn mơ hồ, và ví dụ bạn muốn tự làm thêm.</div>', 'core');

    html += section('Bài tập', '',
      '<span class="badge badge--core">Homework</span><h2>Đưa kiến thức vào sản phẩm</h2><div class="grid grid-2"><div class="task"><h3>Bắt buộc</h3>' + list(lesson.homework.required, true) + '</div><div class="task"><h3>Nâng cao</h3>' + list(lesson.homework.advanced, true) + '</div></div><div class="note"><b>Tự kiểm tra trước khi nộp:</b> chạy lại từ đầu · mở Console · kiểm tra mobile · đặt tên rõ nghĩa · giải thích được code của mình.</div>', 'core');

    var cheat = root.CHEAT_SHEETS && root.CHEAT_SHEETS[lesson.number];
    if (cheat) {
      html += section('Cheat Sheet', '',
        '<span class="badge badge--core">Cheat Sheet · 1 trang</span><h2>Tổng kết cô đọng · ' + escapeHtml(cheat.title) + '</h2><p class="lead">Nhìn lại trong 60 giây: khái niệm, cú pháp và điều cần nhớ.</p>' +
        '<table class="cheat-table"><thead><tr><th>Khái niệm</th><th>Cú pháp / từ khóa</th><th>Nhớ nhanh</th></tr></thead><tbody>' + cheat.items.map(function (item) { return '<tr><td><b>' + escapeHtml(item[0]) + '</b></td><td><code>' + escapeHtml(item[1]) + '</code></td><td>' + escapeHtml(item[2]) + '</td></tr>'; }).join('') + '</tbody></table>' +
        '<div class="cheat-footer"><div><b>Checklist:</b> ' + cheat.checklist.map(function (item) { return '✓ ' + escapeHtml(item); }).join(' · ') + '</div><div class="note note--warn"><b>Bẫy:</b> ' + escapeHtml(cheat.trap) + '</div></div>' +
        '<a class="solution-link" href="../cheatsheet.html?lesson=' + lesson.number + '">Mở bản in / Save PDF →</a>', 'core');
    }

    html += section('Tổng kết', 'slide--title',
      '<span class="badge badge--core">Tổng kết</span><div class="eyebrow">Lesson ' + String(lesson.number).padStart(2, '0') + ' complete</div><h1>' + lesson.summary.title + '</h1><p class="sub">' + lesson.summary.text + '</p><div class="legend">' + lesson.summary.keywords.map(function (word) { return '<span class="badge">' + word + '</span>'; }).join('') + '</div><p class="meta">' + (lesson.number < 13 ? 'Tiếp theo: <a href="lesson-' + String(lesson.number + 1).padStart(2, '0') + '.html">Lesson ' + (lesson.number + 1) + ' · ' + root.COURSE_DATA[lesson.number + 1].title + ' →</a>' : 'Bạn đã hoàn thành lộ trình 13 bài · Đến lúc đưa sản phẩm lên Internet!') + '</p>', 'core');

    deck.innerHTML = html;
  }

  function colorize(raw, pattern, classify) {
    var output = '';
    var lastIndex = 0;
    raw.replace(pattern, function (match) {
      var args = Array.prototype.slice.call(arguments);
      var offset = args[args.length - 2];
      output += escapeHtml(raw.slice(lastIndex, offset));
      output += '<span class="' + classify(args) + '">' + escapeHtml(match) + '</span>';
      lastIndex = offset + match.length;
      return match;
    });
    return output + escapeHtml(raw.slice(lastIndex));
  }

  function highlightSource(raw, lang) {
    if (lang === 'js' || lang === 'ts') {
      return colorize(raw, /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|new|class|true|false|null|undefined|typeof|interface|type|enum)\b|\b(\d+(?:\.\d+)?)\b/g, function (args) {
        if (args[1]) return 't-com';
        if (args[2]) return 't-str';
        if (args[3]) return 't-key';
        return 't-num';
      });
    }
    if (lang === 'css') {
      return colorize(raw, /(\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|([\w-]+)(?=\s*:)|(#[0-9a-fA-F]{3,8}|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|fr)?\b)/g, function (args) {
        if (args[1]) return 't-com';
        if (args[2]) return 't-str';
        if (args[3]) return 't-prop';
        return 't-num';
      });
    }
    return colorize(raw, /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z][^>]*>)/g, function (args) {
      return args[1] ? 't-com' : 't-tag';
    });
  }

  function highlight(codeEl) {
    var lang = codeEl.getAttribute('data-lang') || 'html';
    codeEl.innerHTML = highlightSource(codeEl.textContent, lang);
  }

  function buildDemo(example) {
    var html = '', css = '', js = '';
    Array.prototype.slice.call(example.querySelectorAll('code')).forEach(function (code) {
      var value = code.textContent.trim();
      var lang = code.getAttribute('data-lang');
      if (lang === 'css') css += value + '\n';
      else if (lang === 'js') js += value + '\n';
      else if (lang === 'html') html += value + '\n';
    });
    var output = document.createElement('div');
    output.className = 'demo ' + (example.getAttribute('data-size') || '');
    output.innerHTML = '<div class="label">KẾT QUẢ TRÊN TRÌNH DUYỆT</div>';
    var frame = document.createElement('iframe');
    frame.title = 'Kết quả live demo';
    frame.setAttribute('sandbox', 'allow-scripts allow-modals allow-forms');
    frame.srcdoc = '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>body{font-family:system-ui,sans-serif;margin:0;padding:18px;color:#17203a;background:#f8fafc}*{box-sizing:border-box}button,input,select{font:inherit}' + css + '</style></head><body>' + html + '<script>' + js + '<\/script></body></html>';
    output.appendChild(frame);
    example.appendChild(output);
  }

  function initDeck() {
    var lessonNumber = Number.parseInt(document.body.getAttribute('data-lesson'), 10);
    var lesson = root.COURSE_DATA && root.COURSE_DATA[lessonNumber];
    if (lesson) renderCourse(lesson);

    var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
    if (!slides.length) return;
    var current = parseSlideHash(location.hash, slides.length);
    var progress = document.querySelector('.progress');
    var counter = document.querySelector('.counter');
    var chapter = document.querySelector('.topbar .chapter');
    var overview = document.querySelector('.overview');
    var ovGrid = document.querySelector('.ov-grid');
    var previous = document.querySelector('.btn-prev');
    var next = document.querySelector('.btn-next');

    document.querySelectorAll('.example[data-run]').forEach(buildDemo);
    document.querySelectorAll('pre code').forEach(highlight);

    function show(index) {
      current = clampSlide(index, slides.length);
      slides.forEach(function (slide, i) { slide.classList.toggle('active', i === current); });
      slides[current].scrollTop = 0;
      if (progress) progress.style.width = ((current + 1) / slides.length * 100) + '%';
      if (counter) counter.innerHTML = '<b>' + (current + 1) + '</b> / ' + slides.length;
      if (chapter) chapter.textContent = slides[current].getAttribute('data-chapter') || '';
      if (previous) previous.disabled = current === 0;
      if (next) next.disabled = current === slides.length - 1;
      try { history.replaceState(null, '', '#' + (current + 1)); } catch (error) { location.hash = String(current + 1); }
      document.querySelectorAll('.ov-item').forEach(function (item, i) { item.classList.toggle('current', i === current); });
      slides[current].focus({ preventScroll: true });
    }

    var overviewReturnFocus = null;
    function closeOverview(restoreFocus) {
      if (!overview) return;
      overview.classList.remove('open');
      overview.setAttribute('aria-hidden', 'true');
      if (restoreFocus && overviewReturnFocus && overviewReturnFocus.focus) overviewReturnFocus.focus();
      overviewReturnFocus = null;
    }
    function toggleOverview() {
      if (!overview) return;
      if (overview.classList.contains('open')) { closeOverview(true); return; }
      overviewReturnFocus = document.activeElement;
      overview.classList.add('open');
      overview.setAttribute('aria-hidden', 'false');
      var firstControl = overview.querySelector('button');
      if (firstControl) firstControl.focus();
    }

    if (ovGrid) {
      slides.forEach(function (slide, i) {
        slide.setAttribute('tabindex', '-1');
        var title = slide.querySelector('h1,h2');
        var item = document.createElement('button');
        item.type = 'button'; item.className = 'ov-item';
        item.innerHTML = '<span>' + (i + 1) + ' · ' + escapeHtml(slide.getAttribute('data-chapter') || '') + '</span>' + escapeHtml(title ? title.textContent : 'Slide');
        item.addEventListener('click', function () { closeOverview(); show(i); });
        ovGrid.appendChild(item);
      });
    }

    if (overview) {
      overview.setAttribute('role', 'dialog');
      overview.setAttribute('aria-modal', 'true');
      overview.setAttribute('aria-label', 'Mục lục slide');
    }
    if (previous) { previous.setAttribute('aria-label', 'Slide trước'); previous.addEventListener('click', function () { show(current - 1); }); }
    if (next) { next.setAttribute('aria-label', 'Slide sau'); next.addEventListener('click', function () { show(current + 1); }); }
    var menu = document.querySelector('.btn-menu'); if (menu) { menu.setAttribute('aria-label', 'Mở mục lục slide'); menu.addEventListener('click', toggleOverview); }
    var close = document.querySelector('.overview-close'); if (close) close.addEventListener('click', function () { closeOverview(true); });
    var full = document.querySelector('.btn-full'); if (full) { full.setAttribute('aria-label', 'Bật hoặc tắt toàn màn hình'); full.addEventListener('click', function () { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(function () {}); }); }

    document.addEventListener('keydown', function (event) {
      var overviewOpen = overview && overview.classList.contains('open');
      if (overviewOpen && (event.key === 'Escape' || event.key.toLowerCase() === 'o')) {
        event.preventDefault(); closeOverview(true); return;
      }
      if (isInteractiveElement(event.target)) return;
      if (event.key === 'Escape') closeOverview(true);
      else if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); show(current + 1); }
      else if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); show(current - 1); }
      else if (event.key === 'Home') show(0);
      else if (event.key === 'End') show(slides.length - 1);
      else if (event.key.toLowerCase() === 'o') toggleOverview();
      else if (event.key.toLowerCase() === 'f' && full) full.click();
    });

    var touchStartX = null, touchStartY = null;
    document.addEventListener('touchstart', function (event) {
      if (event.touches.length !== 1 || shouldIgnoreSwipe(event.target)) { touchStartX = touchStartY = null; return; }
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', function (event) {
      if (touchStartX == null || !event.changedTouches.length) return;
      var dx = event.changedTouches[0].clientX - touchStartX;
      var dy = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) show(current + (dx < 0 ? 1 : -1));
      touchStartX = touchStartY = null;
    }, { passive: true });

    show(current);
  }

  var api = { clampSlide: clampSlide, parseSlideHash: parseSlideHash, isInteractiveElement: isInteractiveElement, shouldIgnoreSwipe: shouldIgnoreSwipe, escapeHtml: escapeHtml, highlightSource: highlightSource };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DeckUtils = api;
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDeck);
    else initDeck();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
