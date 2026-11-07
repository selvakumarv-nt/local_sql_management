class ResultsManager {
  constructor() {
    this.thead = document.getElementById('results-thead');
    this.tbody = document.getElementById('results-tbody');
    this.emptyState = document.getElementById('results-empty-state');
    this.metaBadge = document.getElementById('result-meta-badge');
    this.logsConsole = document.getElementById('execution-logs');
    this.searchInput = document.getElementById('result-search-input');
    this.paginationBar = document.getElementById('pagination-bar');
    this.pageInfo = document.getElementById('page-info');

    this.currentData = null; // { columns: [], values: [] }
    this.filteredValues = [];
    this.currentPage = 1;
    this.pageSize = 50;

    this.bindEvents();
  }

  bindEvents() {
    this.searchInput.addEventListener('input', () => this.filterRows());
    document.getElementById('btn-prev-page').onclick = () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTable();
      }
    };
    document.getElementById('btn-next-page').onclick = () => {
      const maxPages = Math.ceil(this.filteredValues.length / this.pageSize);
      if (this.currentPage < maxPages) {
        this.currentPage++;
        this.renderTable();
      }
    };
  }

  renderResults(sqliteResults, executionTimeMs, affectedRows) {
    if (!sqliteResults || sqliteResults.length === 0) {
      this.clearTable();
      this.emptyState.innerHTML = `<p class="text-success">Statement executed successfully in ${executionTimeMs}ms (${affectedRows} row(s) modified).</p>`;
      this.emptyState.style.display = 'flex';
      this.metaBadge.textContent = `${affectedRows} rows modified`;
      this.logSuccess(`Query OK (${executionTimeMs} ms, ${affectedRows} rows affected)`);
      return;
    }

    // Display the last result statement's table
    const lastResult = sqliteResults[sqliteResults.length - 1];
    this.currentData = {
      columns: lastResult.columns,
      values: lastResult.values
    };
    this.filteredValues = [...this.currentData.values];
    this.currentPage = 1;

    this.metaBadge.textContent = `${this.currentData.values.length} rows (${executionTimeMs}ms)`;
    this.emptyState.style.display = 'none';
    this.renderTable();
    this.logSuccess(`SELECT executed returned ${lastResult.values.length} rows (${executionTimeMs}ms)`);
  }

  renderTable() {
    if (!this.currentData) return;
    const { columns } = this.currentData;

    // Header
    let theadHTML = '<tr><th style="width: 40px">#</th>';
    columns.forEach((col, idx) => {
      theadHTML += `<th onclick="resultsManager.sortByColumn(${idx})">${col} ↕</th>`;
    });
    theadHTML += '</tr>';
    this.thead.innerHTML = theadHTML;

    // Body Pagination
    const start = (this.currentPage - 1) * this.pageSize;
    const paged = this.filteredValues.slice(start, start + this.pageSize);

    let tbodyHTML = '';
    paged.forEach((row, rIdx) => {
      tbodyHTML += `<tr><td>${start + rIdx + 1}</td>`;
      row.forEach((cell) => {
        const val = cell === null ? '<span class="text-muted">NULL</span>' : this.escapeHtml(String(cell));
        tbodyHTML += `<td onclick="resultsManager.copyCell(this)">${val}</td>`;
      });
      tbodyHTML += '</tr>';
    });

    this.tbody.innerHTML = tbodyHTML;

    // Pagination info
    const totalPages = Math.ceil(this.filteredValues.length / this.pageSize) || 1;
    this.paginationBar.style.display = totalPages > 1 ? 'flex' : 'none';
    this.pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
  }

  filterRows() {
    const q = this.searchInput.value.toLowerCase();
    if (!this.currentData) return;
    this.filteredValues = this.currentData.values.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(q))
    );
    this.currentPage = 1;
    this.renderTable();
  }

  sortByColumn(colIdx) {
    let ascending = true;
    if (this._lastSortCol === colIdx) {
      ascending = !this._lastSortAsc;
    }
    this._lastSortCol = colIdx;
    this._lastSortAsc = ascending;

    this.filteredValues.sort((a, b) => {
      const valA = a[colIdx];
      const valB = b[colIdx];
      if (valA === valB) return 0;
      if (valA === null) return 1;
      if (valB === null) return -1;
      return (valA > valB ? 1 : -1) * (ascending ? 1 : -1);
    });
    this.renderTable();
  }

  copyCell(tdElem) {
    navigator.clipboard.writeText(tdElem.innerText);
    tdElem.style.outline = '1px solid var(--accent-color)';
    setTimeout(() => (tdElem.style.outline = 'none'), 400);
  }

  logSuccess(msg) {
    this.addLog(msg, 'success');
  }

  logError(msg) {
    this.addLog(msg, 'error');
  }

  addLog(msg, type = 'info') {
    const time = new Date().toLocaleTimeString();
    const div = document.createElement('div');
    div.className = `log-entry ${type}`;
    div.textContent = `[${time}] ${msg}`;
    this.logsConsole.prepend(div);
  }

  clearTable() {
    this.thead.innerHTML = '';
    this.tbody.innerHTML = '';
    this.currentData = null;
    this.filteredValues = [];
    this.paginationBar.style.display = 'none';
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

window.resultsManager = new ResultsManager();