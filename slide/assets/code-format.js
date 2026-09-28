(function (root) {
  'use strict';
  var INDENT = '  ';
  var VOID_TAGS = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i;

  function needsFormatting(source) {
    var lines = String(source).trim().split('\n');
    return lines.length <= 2 || lines.some(function (line) { return line.length > 110; });
  }

  function formatHtml(source) {
    var normalized = String(source).trim().replace(/>\s*</g, '>\n<');
    var lines = normalized.split('\n');
    var depth = 0;
    var output = [];
    lines.forEach(function (raw) {
      var line = raw.trim();
      if (!line) return;
      if (/^<\//.test(line)) depth = Math.max(0, depth - 1);
      output.push(INDENT.repeat(depth) + line);
      var opening = line.match(/^<([a-z][\w-]*)\b[^>]*>/i);
      var closesOnSameLine = opening && new RegExp('<\\/' + opening[1] + '>\s*$', 'i').test(line);
      var selfClosing = /\/>$/.test(line) || (opening && VOID_TAGS.test(opening[1]));
      if (opening && !/^<!/.test(line) && !/^<\//.test(line) && !selfClosing && !closesOnSameLine) depth += 1;
    });
    return output.join('\n');
  }

  function formatBraces(source, language) {
    var text = String(source).trim();
    var output = [];
    var line = '';
    var depth = 0;
    var parenDepth = 0;
    var bracketDepth = 0;
    var quote = null;
    var escaped = false;

    function flush() {
      var value = line.trim();
      if (value) output.push(INDENT.repeat(Math.max(0, depth)) + value);
      line = '';
    }

    for (var index = 0; index < text.length; index += 1) {
      var char = text[index];
      var next = text[index + 1];
      if (quote) {
        line += char;
        if (escaped) escaped = false;
        else if (char === '\\') escaped = true;
        else if (char === quote) quote = null;
        continue;
      }
      if (char === '"' || char === "'" || char === '`') { quote = char; line += char; continue; }
      if (language !== 'css' && char === '/' && next === '/') {
        var end = text.indexOf('\n', index);
        if (end === -1) end = text.length;
        line += text.slice(index, end); index = end - 1; flush(); continue;
      }
      if (char === '/' && next === '*') {
        var commentEnd = text.indexOf('*/', index + 2);
        if (commentEnd === -1) commentEnd = text.length - 2;
        line += text.slice(index, commentEnd + 2); index = commentEnd + 1; flush(); continue;
      }
      if (char === '(') { parenDepth += 1; line += char; continue; }
      if (char === ')') { parenDepth = Math.max(0, parenDepth - 1); line += char; continue; }
      if (char === '[') { bracketDepth += 1; line += char; continue; }
      if (char === ']') { bracketDepth = Math.max(0, bracketDepth - 1); line += char; continue; }
      if (char === '{') { line += ' {'; flush(); depth += 1; continue; }
      if (char === '}') {
        flush(); depth = Math.max(0, depth - 1); line = '}';
        if (next === ';' || next === ',') { line += next; index += 1; }
        flush(); continue;
      }
      if (char === ';') {
        line += char;
        if (language === 'css' || (parenDepth === 0 && bracketDepth === 0)) flush();
        continue;
      }
      if (char === '\n') { flush(); continue; }
      if (/\s/.test(char)) {
        if (line && !/\s$/.test(line)) line += ' ';
        continue;
      }
      line += char;
    }
    flush();
    return output.join('\n');
  }

  function format(source, language) {
    var value = String(source == null ? '' : source).trim();
    if (!value || !needsFormatting(value)) return value;
    if (language === 'html') return formatHtml(value);
    if (language === 'css' || language === 'js' || language === 'ts' || language === 'terminal') return formatBraces(value, language);
    return value;
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function colorize(raw, pattern, classify) {
    var output = '', lastIndex = 0;
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

  function highlight(source, language) {
    var raw = String(source == null ? '' : source);
    if (language === 'js' || language === 'ts') {
      return colorize(raw, /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|new|class|true|false|null|undefined|typeof|interface|type|enum|async|await)\b|\b(\d+(?:\.\d+)?)\b/g, function (args) {
        if (args[1]) return 'tok-comment';
        if (args[2]) return 'tok-string';
        if (args[3]) return 'tok-keyword';
        return 'tok-number';
      });
    }
    if (language === 'css') {
      return colorize(raw, /(\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|([\w-]+)(?=\s*:)|(#[0-9a-fA-F]{3,8}|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|fr|s|deg)?\b)/g, function (args) {
        if (args[1]) return 'tok-comment';
        if (args[2]) return 'tok-string';
        if (args[3]) return 'tok-property';
        return 'tok-number';
      });
    }
    if (language === 'html') {
      return colorize(raw, /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z][^>]*>)/g, function (args) { return args[1] ? 'tok-comment' : 'tok-tag'; });
    }
    if (language === 'terminal') {
      return colorize(raw, /(^\s*#.*$)|("[^"]*"|'[^']*')|(--?[\w-]+)|\b(git|node|npm|npx)\b/gm, function (args) {
        if (args[1]) return 'tok-comment';
        if (args[2]) return 'tok-string';
        if (args[3]) return 'tok-attr';
        return 'tok-command';
      });
    }
    return escapeHtml(raw);
  }

  var api = { format: format, formatHtml: formatHtml, formatBraces: formatBraces, needsFormatting: needsFormatting, highlight: highlight };
  root.CodeFormat = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
