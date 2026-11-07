class Application {
  async bootstrap() {
    // 1. Initialize IndexedDB
    await window.idb.init();

    // 2. Initialize Code Editor
    window.sqlEditor = new SQLEditor('sql-code-input', 'editor-highlight', 'editor-gutter');

    // 3. Mount SQLite WASM Engine & Load Database
    await window.sqliteEngine.init();
    await window.sqliteEngine.loadOrCreateDatabase('default_db');

    // 4. Populate Databases and UI Explorer
    await window.dbExplorer.refresh();
    await window.historyManager.refresh();

    // 5. Check if sample DB needs initialization for empty first runs
    const schema = window.sqliteEngine.getSchema();
    if (schema.length === 0) {
      window.sqliteEngine.execute(SAMPLE_DATABASES.students.sql);
      await window.dbExplorer.refresh();
      window.sqlEditor.setValue('-- Welcome to SQL Practice Playground!\nSELECT * FROM STUDENTS;\nSELECT * FROM COURSES;');
    }

    this.bindGlobalEvents();
    this.registerServiceWorker();
    this.updateDashboardMetrics();
  }

  bindGlobalEvents() {
    // Top Tabs Navigation
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.switchView(tab.getAttribute('data-view'));
      });
    });

    // Lower Results Tabs Navigation
    document.querySelectorAll('.res-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.res-tab').forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.getAttribute('data-res-tab')).classList.add('active');
      });
    });

    // Run Buttons
    document.getElementById('btn-run-query').onclick = () => window.queryExecutor.executeSQL();
    document.getElementById('btn-run-selection').onclick = () => window.queryExecutor.executeSelection();
    document.getElementById('btn-format-sql').onclick = () => window.sqlEditor.formatSQL();
    document.getElementById('btn-clear-editor').onclick = () => window.sqlEditor.setValue('');
    document.getElementById('btn-refresh-schema').onclick = () => window.dbExplorer.refresh();

    // Database switcher dropdown
    document.getElementById('db-select').onchange = async (e) => {
      await window.sqliteEngine.loadOrCreateDatabase(e.target.value);
      window.dbExplorer.refresh();
    };

    // New Database Button
    document.getElementById('btn-new-db').onclick = async () => {
      const name = prompt('Enter a name for the new database:');
      if (name && /^[a-zA-Z0-9_]+$/.test(name)) {
        await window.sqliteEngine.loadOrCreateDatabase(name);
        await window.dbExplorer.refresh();
      } else if (name) {
        alert('Invalid name. Use alphanumeric and underscore characters only.');
      }
    };

    // Dashboard Sample Loaders
    document.querySelectorAll('.btn-sample-db').forEach((btn) => {
      btn.onclick = async () => {
        const key = btn.getAttribute('data-sample');
        const sample = SAMPLE_DATABASES[key];
        if (sample) {
          await window.sqliteEngine.loadOrCreateDatabase(sample.name);
          window.sqliteEngine.execute(sample.sql);
          await window.dbExplorer.refresh();
          alert(`Loaded "${sample.label}" database!`);
          this.switchView('editor-view');
        }
      };
    });
  }

  switchView(viewId) {
    document.querySelectorAll('.view-panel').forEach((panel) => {
      panel.hidden = panel.id !== viewId;
      panel.classList.toggle('active', panel.id === viewId);
    });

    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.getAttribute('data-view') === viewId);
    });

    if (viewId === 'visualizer-view') {
      window.schemaVisualizer.draw();
    } else if (viewId === 'dashboard-view') {
      this.updateDashboardMetrics();
    }
  }

  async updateDashboardMetrics() {
    const dbs = await window.idb.getAllDatabases();
    const history = await window.idb.getHistory();
    const schema = window.sqliteEngine.getSchema();

    document.getElementById('dash-active-db').textContent = window.sqliteEngine.currentDbName;
    document.getElementById('dash-total-tables').textContent = schema.length;
    document.getElementById('dash-queries-count').textContent = history.length;

    const successes = history.filter((h) => h.status === 'SUCCESS').length;
    const rate = history.length > 0 ? Math.round((successes / history.length) * 100) : 100;
    document.getElementById('dash-success-rate').textContent = `${rate}%`;
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('service-worker.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
    }
  }
}

window.app = new Application();
window.addEventListener('DOMContentLoaded', () => window.app.bootstrap());