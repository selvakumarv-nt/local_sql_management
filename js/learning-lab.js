const LEARNING_MODULES = [
  {
    id: 'intro',
    title: '1. Introduction to SQL & Relational Models',
    desc: 'SQL (Structured Query Language) is the standard language for querying, updating, and managing data in relational databases.',
    syntax: '-- SQL comments start with double dashes\nSELECT 1 + 1;',
    example: 'SELECT "Hello SQL World" AS greeting, date() AS current_date;',
    task: 'Execute the example to inspect SQLite system functions.'
  },
  {
    id: 'create_table',
    title: '2. Database & Table Creation (DDL)',
    desc: 'Tables are defined with column names and storage classes: INTEGER, TEXT, REAL, BLOB.',
    syntax: 'CREATE TABLE table_name (\n  col1 datatype PRIMARY KEY,\n  col2 datatype\n);',
    example: 'CREATE TABLE IF NOT EXISTS inventory (\n  id INTEGER PRIMARY KEY,\n  item_name TEXT NOT NULL,\n  qty INTEGER DEFAULT 0\n);',
    task: 'Create the inventory table and refresh your Explorer.'
  },
  {
    id: 'datatypes',
    title: '3. Understanding SQLite Data Types',
    desc: 'SQLite uses type affinity: TEXT, NUMERIC, INTEGER, REAL, and BLOB. It allows storing any value in any column, with specific affinity conversions.',
    syntax: 'CREATE TABLE types_demo (txt TEXT, num REAL, bin BLOB);',
    example: 'SELECT typeof(42) AS int_type, typeof(3.14) AS float_type, typeof("SQL") AS string_type;',
    task: 'Execute the typeof inspection to view SQLite internal representation.'
  },
  {
    id: 'insert',
    title: '4. INSERT Statement',
    desc: 'INSERT INTO stores new records into an existing table.',
    syntax: 'INSERT INTO table_name (col1, col2) VALUES (val1, val2);',
    example: 'INSERT INTO inventory (item_name, qty) VALUES ("Ergonomic Mouse", 40);',
    task: 'Insert an item into the inventory table.'
  },
  {
    id: 'select',
    title: '5. SELECT Statement (DQL)',
    desc: 'SELECT is used to retrieve data from one or more tables.',
    syntax: 'SELECT col1, col2 FROM table_name;',
    example: 'SELECT item_name, qty FROM inventory;',
    task: 'Query the inventory records.'
  },
  {
    id: 'where',
    title: '6. WHERE Clause & Filters',
    desc: 'WHERE filters rows satisfying specific boolean comparisons.',
    syntax: 'SELECT * FROM table_name WHERE condition;',
    example: 'SELECT * FROM inventory WHERE qty > 10;',
    task: 'Filter records with quantity above 10.'
  },
  {
    id: 'update',
    title: '7. UPDATE Statement',
    desc: 'Modifies existing values in a table. Always use a WHERE condition to avoid updating every record!',
    syntax: 'UPDATE table_name SET col = val WHERE condition;',
    example: 'UPDATE inventory SET qty = qty + 5 WHERE item_name = "Ergonomic Mouse";',
    task: 'Increment the inventory quantity.'
  },
  {
    id: 'delete',
    title: '8. DELETE Statement',
    desc: 'Removes records from a table permanently.',
    syntax: 'DELETE FROM table_name WHERE condition;',
    example: 'DELETE FROM inventory WHERE qty <= 0;',
    task: 'Delete empty stock items.'
  },
  {
    id: 'alter',
    title: '9. ALTER TABLE Statement',
    desc: 'Used to rename a table or add new columns to an existing table.',
    syntax: 'ALTER TABLE tbl ADD COLUMN new_col TEXT;',
    example: 'ALTER TABLE inventory ADD COLUMN supplier TEXT;',
    task: 'Add a supplier column.'
  },
  {
    id: 'constraints',
    title: '10. Constraints & Integrity',
    desc: 'Integrity constraints: PRIMARY KEY, UNIQUE, NOT NULL, CHECK, and FOREIGN KEY enforce relational validity.',
    syntax: 'CREATE TABLE t (id INT PRIMARY KEY, score INT CHECK(score >= 0));',
    example: 'CREATE TABLE constraints_demo (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  email TEXT UNIQUE NOT NULL\n);',
    task: 'Inspect integrity constraints handling.'
  },
  {
    id: 'aggregates',
    title: '11. Aggregate Functions',
    desc: 'Calculates multiple values into a single summary result: COUNT, SUM, AVG, MIN, MAX.',
    syntax: 'SELECT COUNT(*), AVG(col) FROM tbl;',
    example: 'SELECT COUNT(*) as total_items, SUM(qty) as grand_total FROM inventory;',
    task: 'Compute aggregate stock stats.'
  },
  {
    id: 'group_by',
    title: '12. GROUP BY & HAVING Clauses',
    desc: 'GROUP BY aggregates rows into summary groups. HAVING filters groups based on aggregate conditions.',
    syntax: 'SELECT col, COUNT(*) FROM tbl GROUP BY col HAVING COUNT(*) > 1;',
    example: 'SELECT supplier, COUNT(*) as items_count FROM inventory GROUP BY supplier HAVING items_count >= 1;',
    task: 'Group data by supplier.'
  },
  {
    id: 'joins',
    title: '13. Relational Joins',
    desc: 'INNER JOIN and LEFT JOIN combine rows from two or more tables based on a related column.',
    syntax: 'SELECT * FROM tableA A INNER JOIN tableB B ON A.id = B.a_id;',
    example: 'SELECT S.first_name, D.dept_name FROM STUDENTS S INNER JOIN DEPARTMENTS D ON S.dept_id = D.dept_id;',
    task: 'Perform an INNER JOIN between Students and Departments.'
  },
  {
    id: 'subqueries',
    title: '14. Subqueries & Nested SELECTs',
    desc: 'A query enclosed within another query to provide dynamic conditions or column values.',
    syntax: 'SELECT * FROM tbl WHERE col IN (SELECT col FROM other);',
    example: 'SELECT first_name FROM STUDENTS WHERE student_id IN (SELECT student_id FROM MARKS WHERE score > 80);',
    task: 'Retrieve students with scores higher than 80 using a subquery.'
  },
  {
    id: 'views',
    title: '15. Views',
    desc: 'A virtual table based on the result-set of an SQL statement.',
    syntax: 'CREATE VIEW view_name AS SELECT ...;',
    example: 'CREATE VIEW HighScorers AS SELECT student_id, score FROM MARKS WHERE score >= 90;',
    task: 'Create and query a View.'
  },
  {
    id: 'indexes',
    title: '16. Indexes & Query Performance',
    desc: 'Indexes accelerate SELECT queries on columns with high search frequency.',
    syntax: 'CREATE INDEX idx_col ON tbl(col);',
    example: 'CREATE INDEX idx_students_email ON STUDENTS(email);',
    task: 'Create an index for fast lookups.'
  },
  {
    id: 'transactions',
    title: '17. Transactions & ACID Controls',
    desc: 'Transactions wrap multiple SQL statements into an atomic operation that can be committed or rolled back.',
    syntax: 'BEGIN TRANSACTION;\n-- statements\nCOMMIT;',
    example: 'BEGIN TRANSACTION;\nINSERT INTO inventory (item_name, qty) VALUES ("Temp Item", 1);\nROLLBACK;',
    task: 'Execute a transaction and verify rollback.'
  }
];

class LearningLab {
  constructor() {
    this.listContainer = document.getElementById('learning-topic-list');
    this.contentPane = document.getElementById('learning-content-pane');
    this.init();
  }

  init() {
    this.listContainer.innerHTML = '';
    LEARNING_MODULES.forEach((mod, index) => {
      const li = document.createElement('li');
      li.className = `topic-item ${index === 0 ? 'active' : ''}`;
      li.textContent = mod.title;
      li.onclick = () => this.selectTopic(index);
      this.listContainer.appendChild(li);
    });
    this.selectTopic(0);
  }

  selectTopic(idx) {
    const mod = LEARNING_MODULES[idx];
    document.querySelectorAll('.topic-item').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });

    this.contentPane.innerHTML = `
      <h2>${mod.title}</h2>
      <p class="topic-desc">${mod.desc}</p>
      
      <h4>Standard Syntax:</h4>
      <pre class="code-block"><code>${mod.syntax}</code></pre>

      <h4>Interactive Example:</h4>
      <pre class="code-block"><code>${mod.example}</code></pre>
      
      <div class="topic-actions">
        <button class="btn btn-primary" onclick="learningLab.tryExample(${idx})">Load in SQL Editor & Run</button>
      </div>

      <div class="topic-practice-box">
        <strong>Practice Challenge:</strong>
        <p>${mod.task}</p>
      </div>
    `;
  }

  tryExample(idx) {
    const mod = LEARNING_MODULES[idx];
    window.sqlEditor.setValue(mod.example);
    window.app.switchView('editor-view');
    window.queryExecutor.executeSQL();
  }
}

window.learningLab = new LearningLab();