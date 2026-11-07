class HistoryManager {
  constructor() {
    this.container = document.getElementById('history-items-container');
    this.searchInput = document.getElementById('history-search-input');
    this.clearBtn = document.getElementById('btn-clear-history');

    this.searchInput.addEventListener('input', () => this.refresh());
    this.clearBtn.onclick = async () => {
      if (confirm('Clear entire SQL execution history?')) {
        await window.idb.clearHistory();
        this.refresh();
      }
    };
  }

  async refresh() {
    const list = await window.idb.getHistory();
    const filter = this.searchInput.value.toLowerCase();
    this.container.innerHTML = '';

    const filtered = list
      .filter((h) => h.query.toLowerCase().includes(filter))
      .reverse();

    if (!filtered.length) {
      this.container.innerHTML = '<div style="padding:12px;color:var(--text-muted);">No history recorded yet.</div>';
      return;
    }

    filtered.forEach((h) => {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.innerHTML = `
        <div class="hist-header">
          <span>${new Date(h.timestamp).toLocaleTimeString()} (${h.durationMs}ms) [${h.database}]</span>
          <button class="btn btn-ghost btn-xs btn-copy-hist">Copy</button>
        </div>
        <pre class="hist-query"><code>${window.resultsManager.escapeHtml(h.query)}</code></pre>
      `;

      item.querySelector('.btn-copy-hist').onclick = () => {
        window.sqlEditor.setValue(h.query);
        window.app.switchView('editor-view');
      };

      this.container.appendChild(item);
    });
  }
}

window.historyManager = new HistoryManager();