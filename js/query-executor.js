class QueryExecutor {
  async executeSQL(sqlOverride = null) {
    const sql = sqlOverride || window.sqlEditor.getValue().trim();
    if (!sql) {
      window.resultsManager.logError('Cannot execute an empty SQL script.');
      return;
    }

    try {
      const res = window.sqliteEngine.execute(sql);
      window.resultsManager.renderResults(res.results, res.executionTimeMs, res.affectedRows);

      // Save History in IndexedDB
      await window.idb.addHistory({
        query: sql,
        database: window.sqliteEngine.currentDbName,
        status: 'SUCCESS',
        durationMs: res.executionTimeMs
      });

      // Update Schema Explorer & Visualizer dynamically
      window.dbExplorer.refresh();
      window.historyManager.refresh();
    } catch (err) {
      window.resultsManager.clearTable();
      window.resultsManager.logError(err.message);

      await window.idb.addHistory({
        query: sql,
        database: window.sqliteEngine.currentDbName,
        status: 'ERROR: ' + err.message,
        durationMs: 0
      });
      window.historyManager.refresh();
    }
  }

  executeSelection() {
    const selected = window.sqlEditor.getSelectedText();
    if (selected) {
      this.executeSQL(selected);
    } else {
      window.resultsManager.logError('No text selected in SQL Editor.');
    }
  }
}

window.queryExecutor = new QueryExecutor();class QueryExecutor {
  async executeSQL(sqlOverride = null) {
    const sql = sqlOverride || window.sqlEditor.getValue().trim();
    if (!sql) {
      window.resultsManager.logError('Cannot execute an empty SQL script.');
      return;
    }

    try {
      const res = window.sqliteEngine.execute(sql);
      window.resultsManager.renderResults(res.results, res.executionTimeMs, res.affectedRows);

      // Save History in IndexedDB
      await window.idb.addHistory({
        query: sql,
        database: window.sqliteEngine.currentDbName,
        status: 'SUCCESS',
        durationMs: res.executionTimeMs
      });

      // Update Schema Explorer & Visualizer dynamically
      window.dbExplorer.refresh();
      window.historyManager.refresh();
    } catch (err) {
      window.resultsManager.clearTable();
      window.resultsManager.logError(err.message);

      await window.idb.addHistory({
        query: sql,
        database: window.sqliteEngine.currentDbName,
        status: 'ERROR: ' + err.message,
        durationMs: 0
      });
      window.historyManager.refresh();
    }
  }

  executeSelection() {
    const selected = window.sqlEditor.getSelectedText();
    if (selected) {
      this.executeSQL(selected);
    } else {
      window.resultsManager.logError('No text selected in SQL Editor.');
    }
  }
}

window.queryExecutor = new QueryExecutor();