/* =========================================================
   Deck engine - dieu huong slide, to mau code, chay demo song
   Khong dung thu vien ngoai => mo file bang trinh duyet la chay.
   ========================================================= */
(function () {
  'use strict';

  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var current = 0;

  /* -------------------------------------------------------
     1. TO MAU CU PHAP (syntax highlight) - rat gon, du dung
     ------------------------------------------------------- */
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var JS_KEYWORDS = /\b(const|let|var|function|return|if|else|for|while|do|of|in|new|class|this|true|false|null|undefined|typeof|break|continue|try|catch)\b/;

  function highlightJs(src) {
    return src.replace(
      /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|\b(const|let|var|function|return|if|else|for|while|do|of|in|new|class|this|true|false|null|undefined|typeof|break|continue|try|catch)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)(?=\s*\()/g,
      function (m, com, str, kw, num, fn) {
        if (com) return '<span class="t-com">' + com + '</span>';
        if (str) return '<span class="t-str">' + str + '</span>';
        if (kw) return '<span class="t-key">' + kw + '</span>';
        if (num) return '<span class="t-num">' + num + '</span>';
        if (fn) return '<span class="t-fn">' + fn + '</span>';
        return m;
      }
    );
  }

  function highlightHtml(src) {
    // Buoc 1: chu thich HTML. Buoc 2: tung the <...> roi to mau ben trong the.
    return src
      .replace(/&lt;!--[\s\S]*?--&gt;/g, function (m) {
        return '<span class="t-com">' + m + '</span>';
      })
      .replace(/&lt;\/?[\s\S]*?&gt;/g, function (tag) {
        if (tag.indexOf('t-com') > -1) return tag;
        var inner = tag
          .replace(/("[^"]*"|'[^']*')/g, '<span class="t-str">$1</span>')
          .replace(/(\s)([a-zA-Z-]+)(=)/g, '$1<span class="t-attr">$2</span>$3');
        return '<span class="t-tag">' + inner + '</span>';
      });
  }

  function highlightCss(src) {
    return src.replace(
      /(\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|([.#]?[\w-]+(?=[^{};]*\{))|([\w-]+)(?=\s*:)|(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|em|rem|%|s|vh|vw|deg|fr)?\b)/g,
      function (m, com, str, sel, prop, num) {
        if (com) return '<span class="t-com">' + com + '</span>';
        if (str) return '<span class="t-str">' + str + '</span>';
        if (sel) return '<span class="t-sel">' + sel + '</span>';
        if (prop) return '<span class="t-prop">' + prop + '</span>';
        if (num) return '<span class="t-num">' + num + '</span>';
        return m;
      }
    );
  }

  function highlight(codeEl) {
    var lang = codeEl.getAttribute('data-lang') || 'html';
    var raw = escapeHtml(codeEl.textContent.replace(/^\n+|\s+$/g, ''));
    if (lang === 'js') codeEl.innerHTML = highlightJs(raw);
    else if (lang === 'css') codeEl.innerHTML = highlightCss(raw);
    else if (lang === 'html') codeEl.innerHTML = highlightHtml(raw);
    else codeEl.innerHTML = raw;
  }

  /* -------------------------------------------------------
     2. DEMO SONG: gom code trong .example roi do vao iframe
     ------------------------------------------------------- */
  var DEMO_BASE = 'body{font-family:system-ui,Segoe UI,Arial,sans-serif;padding:14px;color:#1a1a2e;margin:0}';

  function buildDemo(example) {
    var codes = [].slice.call(example.querySelectorAll('code'));
    var html = '', css = '', js = '';
    codes.forEach(function (c) {
      var lang = c.getAttribute('data-lang');
      var text = c.textContent.replace(/^\n+|\s+$/g, '');
      if (lang === 'css') css += text + '\n';
      else if (lang === 'js') js += text + '\n';
      else html += text + '\n';
    });

    // Neu code da la mot trang HTML day du thi dung nguyen ven
    var doc;
    if (/<!DOCTYPE|<html/i.test(html)) {
      doc = html;
    } else {
      doc = '<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8">' +
            '<style>' + DEMO_BASE + css + '</style></head><body>' +
            html + '<script>' + js + '<\/script></body></html>';
    }

    var box = document.createElement('div');
    box.className = 'demo ' + (example.getAttribute('data-size') || '');
    box.innerHTML = '<div class="label">KET QUA TREN TRINH DUYET</div>';
    var frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts allow-modals allow-forms');
    frame.srcdoc = doc;
    box.appendChild(frame);
    example.appendChild(box);
  }

  /* -------------------------------------------------------
     3. DIEU HUONG SLIDE
     ------------------------------------------------------- */
  var progress = document.querySelector('.progress');
  var counter = document.querySelector('.counter');
  var chapterEl = document.querySelector('.topbar .chapter');

  function show(i) {
    current = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, idx) { s.classList.toggle('active', idx === current); });
    slides[current].scrollTop = 0;
    progress.style.width = ((current + 1) / slides.length * 100) + '%';
    counter.innerHTML = '<b>' + (current + 1) + '</b> / ' + slides.length;
    chapterEl.textContent = slides[current].getAttribute('data-chapter') || '';
    history.replaceState(null, '', '#' + (current + 1));
    document.querySelectorAll('.ov-item').forEach(function (it, idx) {
      it.classList.toggle('current', idx === current);
    });
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT') return;
    var ov = document.querySelector('.overview');
    if (e.key === 'Escape') { ov.classList.remove('open'); return; }
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(slides.length - 1);
    else if (e.key === 'o' || e.key === 'O') ov.classList.toggle('open');
    else if (e.key === 'f' || e.key === 'F') {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    }
  });

  /* -------------------------------------------------------
     4. KHOI TAO
     ------------------------------------------------------- */
  document.querySelectorAll('.example[data-run]').forEach(buildDemo);
  document.querySelectorAll('pre code').forEach(highlight);

  // Cau hoi trac nghiem: bam de hien dap an
  document.querySelectorAll('.q').forEach(function (q) {
    q.addEventListener('click', function () { q.classList.toggle('show'); });
  });

  // Bang tong quan cac slide
  var ovGrid = document.querySelector('.ov-grid');
  slides.forEach(function (s, i) {
    var title = s.querySelector('h1, h2');
    var item = document.createElement('div');
    item.className = 'ov-item';
    item.innerHTML = '<span>' + (i + 1) + ' &middot; ' + (s.getAttribute('data-chapter') || '') + '</span>' +
                     (title ? title.textContent : 'Slide');
    item.addEventListener('click', function () {
      document.querySelector('.overview').classList.remove('open');
      show(i);
    });
    ovGrid.appendChild(item);
  });

  document.querySelector('.btn-next').addEventListener('click', next);
  document.querySelector('.btn-prev').addEventListener('click', prev);
  document.querySelector('.btn-menu').addEventListener('click', function () {
    document.querySelector('.overview').classList.toggle('open');
  });

  var start = parseInt(location.hash.replace('#', ''), 10);
  show(isNaN(start) ? 0 : start - 1);
})();
