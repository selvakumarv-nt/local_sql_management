class SettingsManager {
  constructor() {
    this.themeToggle = document.getElementById('btn-theme-toggle');
    this.fontSizeInput = document.getElementById('setting-font-size');
    this.fontFamilySelect = document.getElementById('setting-font-family');
    this.storageInfo = document.getElementById('storage-quota-info');

    this.bindEvents();
    this.loadPreferences();
  }

  async bindEvents() {
    this.themeToggle.onclick = () => this.toggleTheme();
    this.fontSizeInput.onchange = () => this.savePreferences();
    this.fontFamilySelect.onchange = () => this.savePreferences();

    document.getElementById('btn-download-sqlite-binary').onclick = () => this.downloadBinary();
    document.getElementById('btn-reset-everything').onclick = () => this.resetAll();
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    window.idb.saveSetting('theme', next);
  }

  async loadPreferences() {
    const theme = await window.idb.getSetting('theme', 'dark');
    document.documentElement.setAttribute('data-theme', theme);

    const fSize = await window.idb.getSetting('editor_font_size', '14');
    const fFam = await window.idb.getSetting('editor_font_family', 'ui-monospace, monospace');

    this.fontSizeInput.value = fSize;
    this.fontFamilySelect.value = fFam;
    this.applyEditorStyles(fSize, fFam);
    this.calculateStorage();
  }

  applyEditorStyles(size, fam) {
    const wrapper = document.getElementById('editor-wrapper');
    if (wrapper) {
      wrapper.style.fontSize = `${size}px`;
      wrapper.style.fontFamily = fam;
    }
  }

  savePreferences() {
    const size = this.fontSizeInput.value;
    const fam = this.fontFamilySelect.value;
    this.applyEditorStyles(size, fam);
    window.idb.saveSetting('editor_font_size', size);
    window.idb.saveSetting('editor_font_family', fam);
  }

  async calculateStorage() {
    if (navigator.storage && navigator.storage.estimate) {
      const { usage, quota } = await navigator.storage.estimate();
      const usedKB = (usage / 1024).toFixed(1);
      const totalMB = (quota / (1024 * 1024)).toFixed(0);
      this.storageInfo.textContent = `${usedKB} KB used of ~${totalMB} MB browser allocation.`;
    } else {
      this.storageInfo.textContent = 'Storage API unavailable.';
    }
  }

  downloadBinary() {
    if (!window.sqliteEngine.currentDB) return;
    const binary = window.sqliteEngine.currentDB.export();
    const blob = new Blob([binary], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${window.sqliteEngine.currentDbName}.sqlite`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async resetAll() {
    if (confirm('WARNING: This will purge all IndexedDB databases, preferences, and query history. Continue?')) {
      indexedDB.deleteDatabase('SQLPracticePlaygroundDB');
      localStorage.clear();
      window.location.reload();
    }
  }
}

window.settingsManager = new SettingsManager();