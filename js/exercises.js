const EXERCISE_CATALOG = [
  {
    id: 1,
    level: 'beginner',
    title: 'Retrieve All Students',
    dbPreset: 'students',
    description: 'Select all columns and all records from the `STUDENTS` table.',
    expectedQuery: 'SELECT * FROM STUDENTS;',
    hint: 'Use the wildcard asterisk (*) operator with SELECT.',
    explanation: 'SELECT * fetches all available attributes from the specified relation.'
  },
  {
    id: 2,
    level: 'beginner',
    title: 'Filter High-Credit Courses',
    dbPreset: 'students',
    description: 'List the course name and credits for courses having 4 or more credits.',
    expectedQuery: 'SELECT course_name, credits FROM COURSES WHERE credits >= 4;',
    hint: 'Apply a WHERE filter comparing credits >= 4.',
    explanation: 'The WHERE clause restricts output to rows evaluating to TRUE.'
  },
  {
    id: 3,
    level: 'intermediate',
    title: 'Inner Join: Students & Departments',
    dbPreset: 'students',
    description: 'Display the student first_name, last_name, and corresponding dept_name.',
    expectedQuery: 'SELECT S.first_name, S.last_name, D.dept_name FROM STUDENTS S JOIN DEPARTMENTS D ON S.dept_id = D.dept_id;',
    hint: 'Join STUDENTS with DEPARTMENTS matching the dept_id keys.',
    explanation: 'INNER JOIN combines records having identical department identifiers.'
  },
  {
    id: 4,
    level: 'intermediate',
    title: 'Department Salary Expenditure',
    dbPreset: 'employees',
    description: 'Find the average employee salary grouped by department ID.',
    expectedQuery: 'SELECT E.dept_id, AVG(S.amount) AS avg_salary FROM EMPLOYEES E JOIN SALARIES S ON E.emp_id = S.emp_id GROUP BY E.dept_id;',
    hint: 'Use GROUP BY on dept_id along with the AVG() aggregate.',
    explanation: 'GROUP BY aggregates salaries per department cluster.'
  },
  {
    id: 5,
    level: 'advanced',
    title: 'Students Without Recorded Marks',
    dbPreset: 'students',
    description: 'Find all students who do not have any grades recorded in the MARKS table.',
    expectedQuery: 'SELECT * FROM STUDENTS WHERE student_id NOT IN (SELECT student_id FROM MARKS);',
    hint: 'Use a subquery with NOT IN (SELECT student_id FROM MARKS).',
    explanation: 'Subquery filtering checks membership against existing mark entries.'
  }
];

class ExerciseManager {
  constructor() {
    this.listContainer = document.getElementById('exercise-items-list');
    this.workPane = document.getElementById('exercise-work-pane');
    this.levelFilter = document.getElementById('exercise-level-filter');
    this.currentExercise = null;

    this.bindEvents();
    this.renderList();
  }

  bindEvents() {
    this.levelFilter.addEventListener('change', () => this.renderList());
  }

  renderList() {
    const filter = this.levelFilter.value;
    const items = filter === 'all' ? EXERCISE_CATALOG : EXERCISE_CATALOG.filter((e) => e.level === filter);

    this.listContainer.innerHTML = '';
    items.forEach((ex) => {
      const li = document.createElement('li');
      li.className = 'exercise-list-item';
      li.innerHTML = `
        <span class="ex-badge badge-${ex.level}">${ex.level}</span>
        <strong>${ex.title}</strong>
      `;
      li.onclick = () => this.loadExercise(ex);
      this.listContainer.appendChild(li);
    });

    if (items.length > 0 && !this.currentExercise) {
      this.loadExercise(items[0]);
    }
  }

  async loadExercise(ex) {
    this.currentExercise = ex;

    // Load necessary sample database preset
    if (SAMPLE_DATABASES[ex.dbPreset]) {
      await window.sqliteEngine.loadOrCreateDatabase(SAMPLE_DATABASES[ex.dbPreset].name);
      window.sqliteEngine.execute(SAMPLE_DATABASES[ex.dbPreset].sql);
      await window.dbExplorer.refresh();
    }

    this.workPane.innerHTML = `
      <div class="ex-header">
        <span class="ex-badge badge-${ex.level}">${ex.level.toUpperCase()}</span>
        <h3>${ex.title}</h3>
      </div>
      <p class="ex-desc">${ex.description}</p>
      
      <div class="ex-editor-wrapper">
        <textarea id="ex-sql-input" placeholder="Type your SQL solution here..."></textarea>
      </div>

      <div class="ex-actions">
        <button id="btn-submit-ex" class="btn btn-primary">Check Solution</button>
        <button id="btn-hint-ex" class="btn btn-secondary">Show Hint</button>
        <button id="btn-solution-ex" class="btn btn-outline">Reveal Answer</button>
      </div>

      <div id="ex-feedback-box" class="ex-feedback-box" hidden></div>
    `;

    document.getElementById('btn-submit-ex').onclick = () => this.verifySolution();
    document.getElementById('btn-hint-ex').onclick = () => {
      const fb = document.getElementById('ex-feedback-box');
      fb.hidden = false;
      fb.className = 'ex-feedback-box feedback-info';
      fb.innerHTML = `💡 <strong>Hint:</strong> ${ex.hint}`;
    };
    document.getElementById('btn-solution-ex').onclick = () => {
      const fb = document.getElementById('ex-feedback-box');
      fb.hidden = false;
      fb.className = 'ex-feedback-box feedback-info';
      fb.innerHTML = `📖 <strong>Solution:</strong> <code>${ex.expectedQuery}</code><br><p>${ex.explanation}</p>`;
    };
  }

  verifySolution() {
    const inputSql = document.getElementById('ex-sql-input').value.trim();
    const fb = document.getElementById('ex-feedback-box');
    fb.hidden = false;

    if (!inputSql) {
      fb.className = 'ex-feedback-box feedback-error';
      fb.textContent = 'Please enter a SQL query before submitting.';
      return;
    }

    try {
      // Execute User Query
      const userRes = window.sqliteEngine.execute(inputSql);
      // Execute Master Query
      const expectedRes = window.sqliteEngine.execute(this.currentExercise.expectedQuery);

      const isMatch = this.compareResults(userRes.results, expectedRes.results);

      if (isMatch) {
        fb.className = 'ex-feedback-box feedback-success';
        fb.innerHTML = `🎉 <strong>Correct!</strong> Your query produced the expected result dataset.`;
      } else {
        fb.className = 'ex-feedback-box feedback-error';
        fb.innerHTML = `❌ <strong>Incorrect Result.</strong> The dataset returned does not match the expected solution. Check your columns or filters.`;
      }
    } catch (err) {
      fb.className = 'ex-feedback-box feedback-error';
      fb.innerHTML = `⚠️ <strong>SQL Syntax Error:</strong> ${err.message}`;
    }
  }

  compareResults(userRes, expectedRes) {
    if (!userRes.length || !expectedRes.length) return false;
    const u = userRes[0];
    const e = expectedRes[0];

    if (u.columns.length !== e.columns.length) return false;
    if (u.values.length !== e.values.length) return false;

    // Compare stringified rows
    const uJson = JSON.stringify(u.values.map((r) => r.slice().sort()));
    const eJson = JSON.stringify(e.values.map((r) => r.slice().sort()));
    return uJson === eJson;
  }
}

window.exerciseManager = new ExerciseManager();