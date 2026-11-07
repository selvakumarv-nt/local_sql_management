class DatabaseExplorer {
  constructor() {
    this.treeContainer = document.getElementById('explorer-tree');
    this.dbSelect = document.getElementById('db-select');
  }

  async refresh() {
    await this.renderDbDropdown();
    this.renderSchema();
  }

  async renderDbDropdown() {
    const dbs = await window.idb.getAllDatabases();
    this.dbSelect.innerHTML = '';

    if (dbs.length === 0) {
      // Create default
      await window.sqliteEngine.loadOrCreateDatabase('default_db');
      dbs.push({ name: 'default_db' });
    }

    dbs.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d.name;
      opt.textContent = d.name;
      if (d.name === window.sqliteEngine.currentDbName) opt.selected = true;
      this.dbSelect.appendChild(opt);
    });
  }

  renderSchema() {
    const schema = window.sqliteEngine.getSchema();
    this.treeContainer.innerHTML = '';

    if (!schema.length) {
      this.treeContainer.innerHTML = `<div style="padding:16px; color:var(--text-muted);">No tables present in current database.</div>`;
      return;
    }

    schema.forEach((t) => {
      const node = document.createElement('div');
      node.className = 'tree-table-item';

      const header = document.createElement('div');
      header.className = 'tree-node-table';
      header.innerHTML = `
        <span><strong>🗄 ${t.table}</strong></span>
        <button class="btn btn-ghost btn-xs" title="Generate SELECT Query">SELECT</button>
      `;

      header.querySelector('button').onclick = (e) => {
        e.stopPropagation();
        window.sqlEditor.setValue(`SELECT * FROM ${t.table} LIMIT 100;`);
        window.queryExecutor.executeSQL();
      };

      const colList = document.createElement('ul');
      colList.className = 'tree-columns-list';
      t.columns.forEach((col) => {
        const pkBadge = col.isPk ? '<span class="badge-pk">[PK]</span>' : '';
        const li = document.createElement('li');
        li.innerHTML = `<span>${col.name} ${pkBadge}</span><span>${col.type || 'ANY'}</span>`;
        colList.appendChild(li);
      });

      node.appendChild(header);
      node.appendChild(colList);
      this.treeContainer.appendChild(node);
    });
  }
}

window.dbExplorer = new DatabaseExplorer();