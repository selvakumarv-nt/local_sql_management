class SQLEditor {
  constructor(textareaId, highlightId, gutterId) {
    this.textarea = document.getElementById(textareaId);
    this.highlight = document.getElementById(highlightId).querySelector('code');
    this.gutter = document.getElementById(gutterId);
    this.autocompletePopup = document.getElementById('autocomplete-popup');
    this.cursorPosBadge = document.getElementById('editor-cursor-pos');

    this.keywords = [
      'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
      'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'JOIN', 'INNER', 'LEFT',
      'RIGHT', 'GROUP', 'BY', 'ORDER', 'ASC', 'DESC', 'HAVING', 'LIMIT',
      'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'AS', 'ON', 'AND', 'OR',
      'NOT', 'NULL', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'INTEGER',
      'TEXT', 'REAL', 'BLOB', 'DEFAULT', 'VIEW', 'INDEX', 'PRAGMA'
    ];

    this.bindEvents();
    this.update();
  }

  bindEvents() {
    this.textarea.addEventListener('input', () => {
      this.update();
      this.handleAutocomplete();
    });

    this.textarea.addEventListener('scroll', () => {
      this.highlight.parentElement.scrollTop = this.textarea.scrollTop;
      this.highlight.parentElement.scrollLeft = this.textarea.scrollLeft;
      this.gutter.scrollTop = this.textarea.scrollTop;
    });

    this.textarea.addEventListener('keyup', () => this.updateCursorPos());
    this.textarea.addEventListener('click', () => this.updateCursorPos());

    this.textarea.addEventListener('keydown', (e) => {
      // Indent handling (Tab)
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        this.textarea.value = this.textarea.value.substring(0, start) + '  ' + this.textarea.value.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
        this.update();
      }

      // Keyboard Shortcut: Ctrl + Enter / Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-run-query').click();
      }
    });
  }

  updateCursorPos() {
    const val = this.textarea.value.substring(0, this.textarea.selectionStart);
    const lines = val.split('\n');
    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length + 1;
    this.cursorPosBadge.textContent = `Line ${lineNum}, Col ${colNum}`;
  }

  update() {
    const text = this.textarea.value;
    // Update Line Numbers in Gutter
    const linesCount = text.split('\n').length || 1;
    let gutterHTML = '';
    for (let i = 1; i <= linesCount; i++) {
      gutterHTML += `${i}<br>`;
    }
    this.gutter.innerHTML = gutterHTML;

    // Highlight Code
    this.highlight.innerHTML = this.highlightSyntax(text);
  }

  highlightSyntax(sql) {
    let escaped = sql
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Comments
    escaped = escaped.replace(/(--.*$)/gm, '<span class="token-comment">$1</span>');
    // Strings
    escaped = escaped.replace(/('(?:''|[^'\\]|\\.)*')/g, '<span class="token-string">$1</span>');
    // Numbers
    escaped = escaped.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');
    // Keywords regex
    const kwRegex = new RegExp(`\\b(${this.keywords.join('|')})\\b`, 'gi');
    escaped = escaped.replace(kwRegex, '<span class="token-keyword">$1</span>');

    return escaped;
  }

  handleAutocomplete() {
    const pos = this.textarea.selectionStart;
    const text = this.textarea.value.substring(0, pos);
    const match = text.match(/\b([a-zA-Z_]+)$/);

    if (!match) {
      this.autocompletePopup.hidden = true;
      return;
    }

    const currentWord = match[1].toUpperCase();
    const suggestions = this.keywords.filter((kw) => kw.startsWith(currentWord) && kw !== currentWord);

    if (suggestions.length === 0) {
      this.autocompletePopup.hidden = true;
      return;
    }

    this.autocompletePopup.innerHTML = suggestions
      .slice(0, 6)
      .map((s) => `<li class="autocomplete-item">${s}</li>`)
      .join('');

    this.autocompletePopup.hidden = false;
    this.autocompletePopup.style.left = '60px';
    this.autocompletePopup.style.top = '40px';

    this.autocompletePopup.querySelectorAll('.autocomplete-item').forEach((item) => {
      item.onclick = () => {
        const insertWord = item.textContent;
        const before = this.textarea.value.substring(0, pos - match[1].length);
        const after = this.textarea.value.substring(pos);
        this.textarea.value = before + insertWord + ' ' + after;
        this.autocompletePopup.hidden = true;
        this.update();
        this.textarea.focus();
      };
    });
  }

  setValue(val) {
    this.textarea.value = val;
    this.update();
  }

  getValue() {
    return this.textarea.value;
  }

  getSelectedText() {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    return this.textarea.value.substring(start, end).trim();
  }

  formatSQL() {
    let sql = this.getValue();
    const kws = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'JOIN', 'LEFT JOIN'];
    kws.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      sql = sql.replace(regex, `\n${kw}`);
    });
    this.setValue(sql.trim());
  }
}class SQLEditor {
  constructor(textareaId, highlightId, gutterId) {
    this.textarea = document.getElementById(textareaId);
    this.highlight = document.getElementById(highlightId).querySelector('code');
    this.gutter = document.getElementById(gutterId);
    this.autocompletePopup = document.getElementById('autocomplete-popup');
    this.cursorPosBadge = document.getElementById('editor-cursor-pos');

    this.keywords = [
      'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
      'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'JOIN', 'INNER', 'LEFT',
      'RIGHT', 'GROUP', 'BY', 'ORDER', 'ASC', 'DESC', 'HAVING', 'LIMIT',
      'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'AS', 'ON', 'AND', 'OR',
      'NOT', 'NULL', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'INTEGER',
      'TEXT', 'REAL', 'BLOB', 'DEFAULT', 'VIEW', 'INDEX', 'PRAGMA'
    ];

    this.bindEvents();
    this.update();
  }

  bindEvents() {
    this.textarea.addEventListener('input', () => {
      this.update();
      this.handleAutocomplete();
    });

    this.textarea.addEventListener('scroll', () => {
      this.highlight.parentElement.scrollTop = this.textarea.scrollTop;
      this.highlight.parentElement.scrollLeft = this.textarea.scrollLeft;
      this.gutter.scrollTop = this.textarea.scrollTop;
    });

    this.textarea.addEventListener('keyup', () => this.updateCursorPos());
    this.textarea.addEventListener('click', () => this.updateCursorPos());

    this.textarea.addEventListener('keydown', (e) => {
      // Indent handling (Tab)
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        this.textarea.value = this.textarea.value.substring(0, start) + '  ' + this.textarea.value.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
        this.update();
      }

      // Keyboard Shortcut: Ctrl + Enter / Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-run-query').click();
      }
    });
  }

  updateCursorPos() {
    const val = this.textarea.value.substring(0, this.textarea.selectionStart);
    const lines = val.split('\n');
    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length + 1;
    this.cursorPosBadge.textContent = `Line ${lineNum}, Col ${colNum}`;
  }

  update() {
    const text = this.textarea.value;
    // Update Line Numbers in Gutter
    const linesCount = text.split('\n').length || 1;
    let gutterHTML = '';
    for (let i = 1; i <= linesCount; i++) {
      gutterHTML += `${i}<br>`;
    }
    this.gutter.innerHTML = gutterHTML;

    // Highlight Code
    this.highlight.innerHTML = this.highlightSyntax(text);
  }

  highlightSyntax(sql) {
    let escaped = sql
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Comments
    escaped = escaped.replace(/(--.*$)/gm, '<span class="token-comment">$1</span>');
    // Strings
    escaped = escaped.replace(/('(?:''|[^'\\]|\\.)*')/g, '<span class="token-string">$1</span>');
    // Numbers
    escaped = escaped.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');
    // Keywords regex
    const kwRegex = new RegExp(`\\b(${this.keywords.join('|')})\\b`, 'gi');
    escaped = escaped.replace(kwRegex, '<span class="token-keyword">$1</span>');

    return escaped;
  }

  handleAutocomplete() {
    const pos = this.textarea.selectionStart;
    const text = this.textarea.value.substring(0, pos);
    const match = text.match(/\b([a-zA-Z_]+)$/);

    if (!match) {
      this.autocompletePopup.hidden = true;
      return;
    }

    const currentWord = match[1].toUpperCase();
    const suggestions = this.keywords.filter((kw) => kw.startsWith(currentWord) && kw !== currentWord);

    if (suggestions.length === 0) {
      this.autocompletePopup.hidden = true;
      return;
    }

    this.autocompletePopup.innerHTML = suggestions
      .slice(0, 6)
      .map((s) => `<li class="autocomplete-item">${s}</li>`)
      .join('');

    this.autocompletePopup.hidden = false;
    this.autocompletePopup.style.left = '60px';
    this.autocompletePopup.style.top = '40px';

    this.autocompletePopup.querySelectorAll('.autocomplete-item').forEach((item) => {
      item.onclick = () => {
        const insertWord = item.textContent;
        const before = this.textarea.value.substring(0, pos - match[1].length);
        const after = this.textarea.value.substring(pos);
        this.textarea.value = before + insertWord + ' ' + after;
        this.autocompletePopup.hidden = true;
        this.update();
        this.textarea.focus();
      };
    });
  }

  setValue(val) {
    this.textarea.value = val;
    this.update();
  }

  getValue() {
    return this.textarea.value;
  }

  getSelectedText() {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    return this.textarea.value.substring(start, end).trim();
  }

  formatSQL() {
    let sql = this.getValue();
    const kws = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'JOIN', 'LEFT JOIN'];
    kws.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      sql = sql.replace(regex, `\n${kw}`);
    });
    this.setValue(sql.trim());
  }
}