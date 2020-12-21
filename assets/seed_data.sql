#Employee Tracker seed data
USE employee_cms_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 0), 
("Mike", "Chan", 2, 1), 
("Ashley", "Rodriquez", 3, 2),
("Kevin", "Tupik", 2, 1), 
("Kunal", "Singh", 2, 1), 
("Malia", "Brown", 2, 1), 
("Sarah", "Lourd", 2, 1), 
("Tom", "Allen", 2, 1); 


INSERT INTO role(title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), 
("Salesperson", 80000, 1), 
("Lead Engineer", 150000, 2), 
("Software Engineeer", 120000, 2), 
("Account Manager", 160000, 3), 
("Accountant", 125000, 3), 
("Legal Team Lead", 150000, 4),
("Lawyer", 190000, 4);


INSERT INTO department(name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;