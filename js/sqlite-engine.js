class SQLiteEngine {
  constructor() {
    this.SQL = null;
    this.currentDB = null;
    this.currentDbName = 'default_db';
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    try {
      this.SQL = await window.initSqlJs({
        locateFile: (file) => `vendor/sqlite/${file}`
      });
      this.initialized = true;
    } catch (err) {
      console.error('Failed to initialize SQLite WebAssembly locally:', err);
      throw new Error('SQLite WASM binary failed to load. Ensure vendor files are present.');
    }
  }

  async loadOrCreateDatabase(name) {
    await this.init();
    this.currentDbName = name;
    const binary = await window.idb.getDatabaseBinary(name);

    if (binary) {
      this.currentDB = new this.SQL.Database(binary);
    } else {
      this.currentDB = new this.SQL.Database();
      // Activate SQLite Foreign Key Constraints by default
      this.currentDB.run('PRAGMA foreign_keys = ON;');
      await this.persistCurrentState();
    }
    return this.currentDB;
  }

  async persistCurrentState() {
    if (!this.currentDB) return;
    const binary = this.currentDB.export();
    await window.idb.saveDatabaseBinary(this.currentDbName, binary);
  }

  execute(sqlText) {
    if (!this.currentDB) throw new Error('No database open');

    const startTime = performance.now();
    let results = [];
    let affectedRows = 0;

    // Use exec() which supports multiple semicolon-delimited queries
    const executedResults = this.currentDB.exec(sqlText);
    const duration = (performance.now() - startTime).toFixed(2);

    affectedRows = this.currentDB.getRowsModified();
    this.persistCurrentState();

    return {
      results: executedResults,
      affectedRows: affectedRows,
      executionTimeMs: duration
    };
  }

  getSchema() {
    if (!this.currentDB) return [];
    const query = `
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `;
    const tablesRes = this.currentDB.exec(query);
    if (!tablesRes.length) return [];

    const schema = [];
    const tableNames = tablesRes[0].values.map((v) => v[0]);

    for (const tbl of tableNames) {
      const colRes = this.currentDB.exec(`PRAGMA table_info('${tbl}');`);
      const fkRes = this.currentDB.exec(`PRAGMA foreign_key_list('${tbl}');`);

      const columns = colRes.length
        ? colRes[0].values.map((col) => ({
            cid: col[0],
            name: col[1],
            type: col[2],
            notnull: col[3] === 1,
            defaultValue: col[4],
            isPk: col[5] === 1
          }))
        : [];

      const foreignKeys = fkRes.length
        ? fkRes[0].values.map((fk) => ({
            from: fk[3],
            toTable: fk[2],
            toCol: fk[4]
          }))
        : [];

      schema.push({
        table: tbl,
        columns,
        foreignKeys
      });
    }
    return schema;
  }
}

window.sqliteEngine = new SQLiteEngine();