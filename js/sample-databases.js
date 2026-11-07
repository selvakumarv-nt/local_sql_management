const SAMPLE_DATABASES = {
  students: {
    name: 'students_db',
    label: 'Student Management',
    sql: `
      DROP TABLE IF EXISTS MARKS;
      DROP TABLE IF EXISTS COURSES;
      DROP TABLE IF EXISTS STUDENTS;
      DROP TABLE IF EXISTS DEPARTMENTS;

      CREATE TABLE DEPARTMENTS (
        dept_id INTEGER PRIMARY KEY,
        dept_name TEXT NOT NULL,
        building TEXT
      );

      CREATE TABLE STUDENTS (
        student_id INTEGER PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE,
        dept_id INTEGER,
        enrollment_date DATE,
        FOREIGN KEY (dept_id) REFERENCES DEPARTMENTS(dept_id)
      );

      CREATE TABLE COURSES (
        course_id INTEGER PRIMARY KEY,
        course_name TEXT NOT NULL,
        credits INTEGER NOT NULL,
        dept_id INTEGER,
        FOREIGN KEY (dept_id) REFERENCES DEPARTMENTS(dept_id)
      );

      CREATE TABLE MARKS (
        mark_id INTEGER PRIMARY KEY,
        student_id INTEGER,
        course_id INTEGER,
        score INTEGER CHECK(score >= 0 AND score <= 100),
        FOREIGN KEY (student_id) REFERENCES STUDENTS(student_id),
        FOREIGN KEY (course_id) REFERENCES COURSES(course_id)
      );

      INSERT INTO DEPARTMENTS VALUES (1, 'Computer Science', 'Turing Hall');
      INSERT INTO DEPARTMENTS VALUES (2, 'Electronics', 'Tesla Block');
      INSERT INTO DEPARTMENTS VALUES (3, 'Mathematics', 'Euler Annex');

      INSERT INTO STUDENTS VALUES (101, 'Alex', 'Rivera', 'alex.r@school.edu', 1, '2023-08-15');
      INSERT INTO STUDENTS VALUES (102, 'Sara', 'Chen', 'sara.c@school.edu', 1, '2023-08-15');
      INSERT INTO STUDENTS VALUES (103, 'Liam', 'Vance', 'liam.v@school.edu', 2, '2022-08-10');
      INSERT INTO STUDENTS VALUES (104, 'Maya', 'Patel', 'maya.p@school.edu', 3, '2024-01-12');

      INSERT INTO COURSES VALUES (201, 'Database Systems', 4, 1);
      INSERT INTO COURSES VALUES (202, 'Data Structures', 4, 1);
      INSERT INTO COURSES VALUES (203, 'Linear Algebra', 3, 3);
      INSERT INTO COURSES VALUES (204, 'Digital Logic', 3, 2);

      INSERT INTO MARKS VALUES (1, 101, 201, 88);
      INSERT INTO MARKS VALUES (2, 101, 202, 92);
      INSERT INTO MARKS VALUES (3, 102, 201, 75);
      INSERT INTO MARKS VALUES (4, 103, 204, 84);
      INSERT INTO MARKS VALUES (5, 104, 203, 95);
    `
  },
  employees: {
    name: 'employees_db',
    label: 'Employee Management',
    sql: `
      DROP TABLE IF EXISTS PROJECTS;
      DROP TABLE IF EXISTS SALARIES;
      DROP TABLE IF EXISTS EMPLOYEES;
      DROP TABLE IF EXISTS DEPARTMENTS;

      CREATE TABLE DEPARTMENTS (
        dept_id INTEGER PRIMARY KEY,
        dept_name TEXT NOT NULL,
        location TEXT
      );

      CREATE TABLE EMPLOYEES (
        emp_id INTEGER PRIMARY KEY,
        emp_name TEXT NOT NULL,
        role TEXT NOT NULL,
        dept_id INTEGER,
        hire_date DATE,
        FOREIGN KEY (dept_id) REFERENCES DEPARTMENTS(dept_id)
      );

      CREATE TABLE SALARIES (
        emp_id INTEGER PRIMARY KEY,
        amount REAL NOT NULL,
        bonus REAL DEFAULT 0,
        FOREIGN KEY (emp_id) REFERENCES EMPLOYEES(emp_id)
      );

      CREATE TABLE PROJECTS (
        project_id INTEGER PRIMARY KEY,
        project_name TEXT NOT NULL,
        lead_emp_id INTEGER,
        budget REAL,
        FOREIGN KEY (lead_emp_id) REFERENCES EMPLOYEES(emp_id)
      );

      INSERT INTO DEPARTMENTS VALUES (10, 'Engineering', 'Floor 4');
      INSERT INTO DEPARTMENTS VALUES (20, 'Product', 'Floor 3');
      INSERT INTO DEPARTMENTS VALUES (30, 'Marketing', 'Floor 2');

      INSERT INTO EMPLOYEES VALUES (1, 'Alice Walker', 'Lead Architect', 10, '2020-03-01');
      INSERT INTO EMPLOYEES VALUES (2, 'Bob Morris', 'Data Engineer', 10, '2021-06-15');
      INSERT INTO EMPLOYEES VALUES (3, 'Chloe Sims', 'Product Manager', 20, '2019-11-01');
      INSERT INTO EMPLOYEES VALUES (4, 'Daniel Craig', 'Growth Marketer', 30, '2022-02-10');

      INSERT INTO SALARIES VALUES (1, 120000, 15000);
      INSERT INTO SALARIES VALUES (2, 95000, 8000);
      INSERT INTO SALARIES VALUES (3, 110000, 12000);
      INSERT INTO SALARIES VALUES (4, 75000, 5000);

      INSERT INTO PROJECTS VALUES (1001, 'Cloud Migration', 1, 500000);
      INSERT INTO PROJECTS VALUES (1002, 'App Redesign', 3, 200000);
    `
  },
  shop: {
    name: 'shop_db',
    label: 'Store & Orders Management',
    sql: `
      DROP TABLE IF EXISTS ORDER_DETAILS;
      DROP TABLE IF EXISTS ORDERS;
      DROP TABLE IF EXISTS PRODUCTS;
      DROP TABLE IF EXISTS CUSTOMERS;

      CREATE TABLE CUSTOMERS (
        customer_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT,
        country TEXT
      );

      CREATE TABLE PRODUCTS (
        product_id INTEGER PRIMARY KEY,
        product_name TEXT NOT NULL,
        unit_price REAL NOT NULL,
        stock_qty INTEGER NOT NULL
      );

      CREATE TABLE ORDERS (
        order_id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        order_date DATE,
        FOREIGN KEY (customer_id) REFERENCES CUSTOMERS(customer_id)
      );

      CREATE TABLE ORDER_DETAILS (
        detail_id INTEGER PRIMARY KEY,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES ORDERS(order_id),
        FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
      );

      INSERT INTO CUSTOMERS VALUES (1, 'John Doe', 'London', 'UK');
      INSERT INTO CUSTOMERS VALUES (2, 'Jane Smith', 'New York', 'USA');
      INSERT INTO CUSTOMERS VALUES (3, 'Carlos Santana', 'Madrid', 'Spain');

      INSERT INTO PRODUCTS VALUES (1, 'Mechanical Keyboard', 89.99, 120);
      INSERT INTO PRODUCTS VALUES (2, 'Wireless Mouse', 49.50, 250);
      INSERT INTO PRODUCTS VALUES (3, '4K Monitor', 320.00, 45);

      INSERT INTO ORDERS VALUES (501, 1, '2024-03-01');
      INSERT INTO ORDERS VALUES (502, 2, '2024-03-02');
      INSERT INTO ORDERS VALUES (503, 1, '2024-03-05');

      INSERT INTO ORDER_DETAILS VALUES (1, 501, 1, 2);
      INSERT INTO ORDER_DETAILS VALUES (2, 501, 2, 1);
      INSERT INTO ORDER_DETAILS VALUES (3, 502, 3, 1);
      INSERT INTO ORDER_DETAILS VALUES (4, 503, 2, 3);
    `
  }
};const SAMPLE_DATABASES = {
  students: {
    name: 'students_db',
    label: 'Student Management',
    sql: `
      DROP TABLE IF EXISTS MARKS;
      DROP TABLE IF EXISTS COURSES;
      DROP TABLE IF EXISTS STUDENTS;
      DROP TABLE IF EXISTS DEPARTMENTS;

      CREATE TABLE DEPARTMENTS (
        dept_id INTEGER PRIMARY KEY,
        dept_name TEXT NOT NULL,
        building TEXT
      );

      CREATE TABLE STUDENTS (
        student_id INTEGER PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE,
        dept_id INTEGER,
        enrollment_date DATE,
        FOREIGN KEY (dept_id) REFERENCES DEPARTMENTS(dept_id)
      );

      CREATE TABLE COURSES (
        course_id INTEGER PRIMARY KEY,
        course_name TEXT NOT NULL,
        credits INTEGER NOT NULL,
        dept_id INTEGER,
        FOREIGN KEY (dept_id) REFERENCES DEPARTMENTS(dept_id)
      );

      CREATE TABLE MARKS (
        mark_id INTEGER PRIMARY KEY,
        student_id INTEGER,
        course_id INTEGER,
        score INTEGER CHECK(score >= 0 AND score <= 100),
        FOREIGN KEY (student_id) REFERENCES STUDENTS(student_id),
        FOREIGN KEY (course_id) REFERENCES COURSES(course_id)
      );

      INSERT INTO DEPARTMENTS VALUES (1, 'Computer Science', 'Turing Hall');
      INSERT INTO DEPARTMENTS VALUES (2, 'Electronics', 'Tesla Block');
      INSERT INTO DEPARTMENTS VALUES (3, 'Mathematics', 'Euler Annex');

      INSERT INTO STUDENTS VALUES (101, 'Alex', 'Rivera', 'alex.r@school.edu', 1, '2023-08-15');
      INSERT INTO STUDENTS VALUES (102, 'Sara', 'Chen', 'sara.c@school.edu', 1, '2023-08-15');
      INSERT INTO STUDENTS VALUES (103, 'Liam', 'Vance', 'liam.v@school.edu', 2, '2022-08-10');
      INSERT INTO STUDENTS VALUES (104, 'Maya', 'Patel', 'maya.p@school.edu', 3, '2024-01-12');

      INSERT INTO COURSES VALUES (201, 'Database Systems', 4, 1);
      INSERT INTO COURSES VALUES (202, 'Data Structures', 4, 1);
      INSERT INTO COURSES VALUES (203, 'Linear Algebra', 3, 3);
      INSERT INTO COURSES VALUES (204, 'Digital Logic', 3, 2);

      INSERT INTO MARKS VALUES (1, 101, 201, 88);
      INSERT INTO MARKS VALUES (2, 101, 202, 92);
      INSERT INTO MARKS VALUES (3, 102, 201, 75);
      INSERT INTO MARKS VALUES (4, 103, 204, 84);
      INSERT INTO MARKS VALUES (5, 104, 203, 95);
    `
  },
  employees: {
    name: 'employees_db',
    label: 'Employee Management',
    sql: `
      DROP TABLE IF EXISTS PROJECTS;
      DROP TABLE IF EXISTS SALARIES;
      DROP TABLE IF EXISTS EMPLOYEES;
      DROP TABLE IF EXISTS DEPARTMENTS;

      CREATE TABLE DEPARTMENTS (
        dept_id INTEGER PRIMARY KEY,
        dept_name TEXT NOT NULL,
        location TEXT
      );

      CREATE TABLE EMPLOYEES (
        emp_id INTEGER PRIMARY KEY,
        emp_name TEXT NOT NULL,
        role TEXT NOT NULL,
        dept_id INTEGER,
        hire_date DATE,
        FOREIGN KEY (dept_id) REFERENCES DEPARTMENTS(dept_id)
      );

      CREATE TABLE SALARIES (
        emp_id INTEGER PRIMARY KEY,
        amount REAL NOT NULL,
        bonus REAL DEFAULT 0,
        FOREIGN KEY (emp_id) REFERENCES EMPLOYEES(emp_id)
      );

      CREATE TABLE PROJECTS (
        project_id INTEGER PRIMARY KEY,
        project_name TEXT NOT NULL,
        lead_emp_id INTEGER,
        budget REAL,
        FOREIGN KEY (lead_emp_id) REFERENCES EMPLOYEES(emp_id)
      );

      INSERT INTO DEPARTMENTS VALUES (10, 'Engineering', 'Floor 4');
      INSERT INTO DEPARTMENTS VALUES (20, 'Product', 'Floor 3');
      INSERT INTO DEPARTMENTS VALUES (30, 'Marketing', 'Floor 2');

      INSERT INTO EMPLOYEES VALUES (1, 'Alice Walker', 'Lead Architect', 10, '2020-03-01');
      INSERT INTO EMPLOYEES VALUES (2, 'Bob Morris', 'Data Engineer', 10, '2021-06-15');
      INSERT INTO EMPLOYEES VALUES (3, 'Chloe Sims', 'Product Manager', 20, '2019-11-01');
      INSERT INTO EMPLOYEES VALUES (4, 'Daniel Craig', 'Growth Marketer', 30, '2022-02-10');

      INSERT INTO SALARIES VALUES (1, 120000, 15000);
      INSERT INTO SALARIES VALUES (2, 95000, 8000);
      INSERT INTO SALARIES VALUES (3, 110000, 12000);
      INSERT INTO SALARIES VALUES (4, 75000, 5000);

      INSERT INTO PROJECTS VALUES (1001, 'Cloud Migration', 1, 500000);
      INSERT INTO PROJECTS VALUES (1002, 'App Redesign', 3, 200000);
    `
  },
  shop: {
    name: 'shop_db',
    label: 'Store & Orders Management',
    sql: `
      DROP TABLE IF EXISTS ORDER_DETAILS;
      DROP TABLE IF EXISTS ORDERS;
      DROP TABLE IF EXISTS PRODUCTS;
      DROP TABLE IF EXISTS CUSTOMERS;

      CREATE TABLE CUSTOMERS (
        customer_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT,
        country TEXT
      );

      CREATE TABLE PRODUCTS (
        product_id INTEGER PRIMARY KEY,
        product_name TEXT NOT NULL,
        unit_price REAL NOT NULL,
        stock_qty INTEGER NOT NULL
      );

      CREATE TABLE ORDERS (
        order_id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        order_date DATE,
        FOREIGN KEY (customer_id) REFERENCES CUSTOMERS(customer_id)
      );

      CREATE TABLE ORDER_DETAILS (
        detail_id INTEGER PRIMARY KEY,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES ORDERS(order_id),
        FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
      );

      INSERT INTO CUSTOMERS VALUES (1, 'John Doe', 'London', 'UK');
      INSERT INTO CUSTOMERS VALUES (2, 'Jane Smith', 'New York', 'USA');
      INSERT INTO CUSTOMERS VALUES (3, 'Carlos Santana', 'Madrid', 'Spain');

      INSERT INTO PRODUCTS VALUES (1, 'Mechanical Keyboard', 89.99, 120);
      INSERT INTO PRODUCTS VALUES (2, 'Wireless Mouse', 49.50, 250);
      INSERT INTO PRODUCTS VALUES (3, '4K Monitor', 320.00, 45);

      INSERT INTO ORDERS VALUES (501, 1, '2024-03-01');
      INSERT INTO ORDERS VALUES (502, 2, '2024-03-02');
      INSERT INTO ORDERS VALUES (503, 1, '2024-03-05');

      INSERT INTO ORDER_DETAILS VALUES (1, 501, 1, 2);
      INSERT INTO ORDER_DETAILS VALUES (2, 501, 2, 1);
      INSERT INTO ORDER_DETAILS VALUES (3, 502, 3, 1);
      INSERT INTO ORDER_DETAILS VALUES (4, 503, 2, 3);
    `
  }
};