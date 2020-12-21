#Employee Tracker seed data
USE employee_cms_db;
INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Jane", "Doe", 1, 0),
  ("John", "Doe", 2, 1),
  ("Mary Beth", "McAllister", 3, 2);
INSERT INTO
  role(title, salary, department_id)
VALUES
  ("CEO", 250000, 1),
  ("IT Director", 200000, 5),
  ("IT Manager", 125000, 5),
  ("IT Engineeer", 115000, 5),
  ("Salesman", 95000, 4),
  ("HR Administrator", 45000, 2),
  ("Lawyer", 112000, 6);
INSERT INTO
  department(name)
VALUES
  ("Executives"),
  ("HR"),
  ("Finance"),
  ("Sales"),
  ("IT"),
  ("GRC");
SELECT
  *
FROM
  employee;
SELECT
  *
FROM
  role;
SELECT
  *
FROM
  department;