class SchemaVisualizer {
  constructor() {
    this.canvas = document.getElementById('visualizer-canvas');
    this.svg = document.getElementById('visualizer-svg');
    this.tablesLayer = document.getElementById('visualizer-tables-layer');
    document.getElementById('btn-refresh-visualizer').onclick = () => this.draw();
  }

  draw() {
    const schema = window.sqliteEngine.getSchema();
    this.tablesLayer.innerHTML = '';
    this.svg.innerHTML = '';

    if (!schema.length) {
      this.tablesLayer.innerHTML = '<p class="empty-state">No tables available to visualize.</p>';
      return;
    }

    const tablePositions = {};
    let leftOffset = 40;
    let topOffset = 40;

    schema.forEach((tbl, idx) => {
      const card = document.createElement('div');
      card.className = 'visualizer-table-card';
      card.id = `vis-tbl-${tbl.table}`;
      card.style.left = `${leftOffset}px`;
      card.style.top = `${topOffset}px`;

      let colsHTML = '';
      tbl.columns.forEach((col) => {
        colsHTML += `
          <div class="vis-col-row">
            <span>${col.isPk ? '🔑 ' : ''}${col.name}</span>
            <span class="text-muted">${col.type}</span>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="vis-table-title">${tbl.table}</div>
        <div class="vis-columns">${colsHTML}</div>
      `;

      this.tablesLayer.appendChild(card);
      tablePositions[tbl.table] = { x: leftOffset + 180, y: topOffset + 30 };

      leftOffset += 240;
      if (leftOffset > 720) {
        leftOffset = 40;
        topOffset += 220;
      }
    });

    // Draw SVG Foreign Key Relationship Lines
    schema.forEach((tbl) => {
      tbl.foreignKeys.forEach((fk) => {
        const fromPos = tablePositions[tbl.table];
        const toPos = tablePositions[fk.toTable];
        if (fromPos && toPos) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          path.setAttribute('x1', fromPos.x);
          path.setAttribute('y1', fromPos.y);
          path.setAttribute('x2', toPos.x);
          path.setAttribute('y2', toPos.y);
          path.setAttribute('stroke', 'var(--accent-color)');
          path.setAttribute('stroke-width', '2');
          path.setAttribute('stroke-dasharray', '4');
          this.svg.appendChild(path);
        }
      });
    });
  }
}

window.schemaVisualizer = new SchemaVisualizer();