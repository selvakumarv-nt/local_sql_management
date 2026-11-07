class ImportExportManager {
  constructor() {
    this.modal = document.getElementById('modal-import');
    this.fileInput = document.getElementById('import-file-input');
    this.csvOptions = document.getElementById('csv-options');
    this.csvTableName = document.getElementById('csv-table-name');
    this.confirmBtn = document.getElementById('btn-confirm-import');

    this.parsedCsvData = null;
    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('btn-quick-import').onclick = () => this.openModal();
    this.fileInput.addEventListener('change', (e) => this.handleFile(e));
    this.confirmBtn.onclick = () => this.executeImport();

    // Export Triggers
    document.getElementById('btn-export-csv').onclick = () => this.exportCurrentGridCSV();
    document.getElementById('btn-copy-results').onclick = () => this.copyCurrentResults();
  }

  openModal() {
    this.modal.hidden = false;
  }

  closeModal() {
    this.modal.hidden = true;
    this.fileInput.value = '';
    this.csvOptions.hidden = true;
    this.confirmBtn.disabled = true;
  }

  handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.sql')) {
      this.csvOptions.hidden = true;
      this.confirmBtn.disabled = false;
    } else if (file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.parseCSV(evt.target.result);
        this.csvOptions.hidden = false;
        this.csvTableName.value = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_');
        this.confirmBtn.disabled = false;
      };
      reader.readAsText(file);
    }
  }

  parseCSV(text) {
    const lines = text.trim().split('\n').map((l) => l.split(',').map((c) => c.trim().replace(/^"|"$/g, '')));
    if (lines.length > 0) {
      this.parsedCsvData = {
        headers: lines[0],
        rows: lines.slice(1)
      };
      // Render Preview
      let html = '<table class="data-table"><thead><tr>';
      this.parsedCsvData.headers.forEach((h) => (html += `<th>${h}</th>`));
      html += '</tr></thead><tbody>';
      this.parsedCsvData.rows.slice(0, 3).forEach((r) => {
        html += '<tr>' + r.map((cell) => `<td>${cell}</td>`).join('') + '</tr>';
      });
      html += '</tbody></table>';
      document.getElementById('csv-preview-table-wrapper').innerHTML = html;
    }
  }

  async executeImport() {
    const file = this.fileInput.files[0];
    if (!file) return;

    if (file.name.endsWith('.sql')) {
      const sqlText = await file.text();
      window.queryExecutor.executeSQL(sqlText);
      this.closeModal();
    } else if (file.name.endsWith('.csv') && this.parsedCsvData) {
      const tableName = this.csvTableName.value.trim() || 'imported_data';
      const cols = this.parsedCsvData.headers.map((h) => `"${h}" TEXT`).join(', ');
      let ddl = `CREATE TABLE IF NOT EXISTS "${tableName}" (${cols});\n`;

      this.parsedCsvData.rows.forEach((row) => {
        const vals = row.map((v) => `'${v.replace(/'/g, "''")}'`).join(', ');
        ddl += `INSERT INTO "${tableName}" VALUES (${vals});\n`;
      });

      window.queryExecutor.executeSQL(ddl);
      this.closeModal();
    }
  }

  exportCurrentGridCSV() {
    const data = window.resultsManager.currentData;
    if (!data) return;

    let csv = data.columns.join(',') + '\n';
    data.values.forEach((row) => {
      csv += row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  copyCurrentResults() {
    const data = window.resultsManager.currentData;
    if (!data) return;
    const tsv = [data.columns.join('\t'), ...data.values.map((r) => r.join('\t'))].join('\n');
    navigator.clipboard.writeText(tsv);
    alert('Query results copied to clipboard as TSV format.');
  }
}

window.importExport = new ImportExportManager();