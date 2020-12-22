const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

//connection information
const connection = mysql.createConnection({
  host: "localhost",
  PORT: 3306,
  user: "root",
  password: "root",
  database: "employee_cms_db",
});

const viewAllEmployees = () => {
  connection.query(
    "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager  FROM employee e LEFT JOIN employee m  ON e.manager_id = m.id INNER JOIN role  ON e.role_id = role.id INNER JOIN department  ON role.department_id = department.id ORDER BY ID ASC;",
    (err, data) => {
      if (err) throw err;
      console.log("\n");
      //database will return an array of objects and console.table will format the returned data
      console.table(data);
    }
  );
  mainMenu();
};
const viewAllDepartments = () => {
  connection.query(
    "SELECT id, name AS department FROM department ORDER BY ID ASC;",
    (err, data) => {
      if (err) throw err;
      console.log("\n");
      //database will return an array of objects and console.table will format the returned data
      console.table(data);
    }
  );
  mainMenu();
};
const viewAllRoles = () => {
  connection.query(
    "SELECT r.id, r.title AS role, r.salary, d.name AS department FROM role r LEFT JOIN department d ON r.department_id=d.id ORDER by department ASC",
    (err, data) => {
      if (err) throw err;
      console.log("\n");
      //database will return an array of objects and console.table will format the returned data
      console.table(data);
    }
  );
  mainMenu();
};
const viewAllEmployeesByDept = () => {
  connection.query(
    "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager  FROM employee e LEFT JOIN employee m  ON e.manager_id = m.id INNER JOIN role  ON e.role_id = role.id INNER JOIN department  ON role.department_id = department.id ORDER BY department ASC;",
    (err, data) => {
      if (err) throw err;
      console.log("\n");
      //database will return an array of objects and console.table will format the returned data
      console.table(data);
    }
  );
  mainMenu();
};
const viewAllEmployeesByManager = () => {
  connection.query(
    "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager  FROM employee e LEFT JOIN employee m  ON e.manager_id = m.id INNER JOIN role  ON e.role_id = role.id INNER JOIN department  ON role.department_id = department.id ORDER BY manager ASC;",
    (err, data) => {
      if (err) throw err;
      console.log("\n");
      //database will return an array of objects and console.table will format the returned data
      console.table(data);
    }
  );
  mainMenu();
};
const addEmployee = () => {
  // Get list of current roles
  let currentRoles = [];
  connection.query("SELECT title AS 'name' FROM role;", (err, res) => {
    if (err) throw err;
    currentRoles = res;
    // Get list of current employees for managers
    let currentManagers = [];
    connection.query(
      "SELECT CONCAT(first_name, ' ',last_name) as name FROM employee;",
      (err, res2) => {
        if (err) throw err;
        currentManagers = res2;
        // Prompt for input on new employee
        inquirer
          .prompt([
            {
              type: "input",
              message: "Enter First Name:",
              name: "first",
              // Validate field is not blank
              validate: function (input) {
                if (input === "") {
                  console.log("First name required to create new employee.");
                  return false;
                } else {
                  return true;
                }
              },
            },
            {
              type: "input",
              message: "Enter Last Name:",
              name: "last",
              validate: function (input) {
                if (input === "") {
                  console.log("Last name required to create new employee.");
                  return false;
                } else {
                  return true;
                }
              },
            },
            {
              type: "list",
              message: `Select their Role:`,
              choices: currentRoles,
              name: "role",
            },
            {
              type: "list",
              message: `Select their Manager:`,
              choices: currentManagers,
              name: "manager",
            },
          ])
          .then((response) => {
            // Get the id for the selected role
            connection.query(
              "SELECT id FROM role WHERE title = ?;",
              response.role,
              (err, res3) => {
                if (err) throw err;
                // Get the id for the selected manager
                connection.query(
                  "SELECT id FROM employee WHERE CONCAT(first_name, ' ',last_name) = ?;",
                  response.manager,
                  (err, res4) => {
                    if (err) throw err;
                    // Add this employee to the database
                    const query =
                      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                    connection.query(
                      query,
                      [response.first, response.last, res3[0].id, res4[0].id],
                      (err, res) => {
                        if (err) throw err;
                        console.log(`Employee Added`);
                        viewAllEmployees();
                      }
                    );
                  }
                );
              }
            );
          });
      }
    );
  });
};
const addRole = () => {
  let currentDepartments = [];
  connection.query(
    "SELECT name AS 'department' FROM department;",
    (err, res) => {
      if (err) throw err;
      currentDepartments = res;
      // console.log(res);

      inquirer
        .prompt([
          {
            type: "input",
            message: "Type the name of the new role.",
            name: "role",
            validate: function (input) {
              if (input === "") {
                console.log(
                  "New Role name must consist of more than one character."
                );
                return false;
              } else {
                return true;
              }
            },
          },
          {
            type: "input",
            message: "What is the salary for this new role?",
            name: "salary",
          },
          {
            type: "list",
            message: "Select the department the new role will reside in.",
            choices: currentDepartments,
            name: "department",
          },
        ])
        .then((response) => {
          //Get id for selected department
          connection.query(
            "SELECT id FROM department WHERE name = ?;",
            response.department,
            (err, res2) => {
              if (err) throw err;
              connection.query(
                "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
                [response.role, response.salary, res2[0].id],
                (err, res) => {
                  if (err) throw err;
                  console.log(`Role Added`);
                  viewAllRoles();
                }
              );
            }
          );
        });
    }
  );
};
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Type name of new department.",
        name: "department",
        // Validate field is not blank
        validate: function (input) {
          if (input === "") {
            console.log("Value required to create new Department");
            return false;
          } else {
            return true;
          }
        },
      },
    ])
    .then((response) => {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        [response.department],
        (err, res) => {
          if (err) throw err;
          console.log("Department Added");
          viewAllDepartments();
        }
      );
    });
};
const updateEmpRole = () => {
  let currentEmployees = [];
  connection.query();
};
const updateEmpManager = () => {};
const updateEmpDept = () => {};
const delEmployee = () => {};
const delRole = () => {};
const delDept = () => {};

const start = () => {
  console.log(
    chalk.yellow.bold(
      `----------------------------------------------------------------`
    )
  );
  console.log(
    chalk.yellow(figlet.textSync("Employee", { horizontalLayout: "full" }))
  );
  console.log(
    chalk.yellow(figlet.textSync("Manager", { horizontalLayout: "full" }))
  );
  console.log(
    chalk.yellow.bold(
      `----------------------------------------------------------------`
    )
  );
  mainMenu();
};

const mainMenu = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do? ",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Update Employee Role",
        "Update Employee Manager",
        "Update Employee Department",
        "Remove Employee",
        "Remove Role",
        "Remove Department",
        "Exit",
      ],
      name: "main",
    })
    .then(({ main }) => {
      console.log(main);
      switch (main) {
        case "View All Employees":
          //   console.log("View All Employees selected");
          return viewAllEmployees();
        case "View All Departments":
          //   console.log("View All Departments selected");
          return viewAllDepartments();
        case "View All Roles":
          //   console.log("View All Roles selected");
          return viewAllRoles();
        case "View All Employees By Department":
          //   console.log("View All Employees By Department selected");
          return viewAllEmployeesByDept();
        case "View All Employees By Manager":
          //   console.log("View All Employees By Manager selected");
          return viewAllEmployeesByManager();
        case "Add Employee":
          //   console.log("Add Employee selected");
          return addEmployee();
        case "Add Role":
          //   console.log("Add Role selected");
          return addRole();
        case "Add Department":
          // console.log("Add Department selected");
          return addDepartment();
        case "Update Employee Role":
          // console.log("Update Employee Role selected");
          return updateEmpRole();
        case "Update Employee Manager":
          // console.log("Update Employee Manager selected");
          return updateEmpManager();
        case "Update Employee Department":
          // console.log("Update Employee Department selected");
          return updateEmpDept();
        case "Remove Employee":
          // console.log("Remove Employee selected");
          return delEmployee();
        case "Remove Role":
          // console.log("Remove Role selected");
          return delRole();
        case "Remove Department":
          // console.log("Remove Department selected");
          return delDept();
        default:
          connection.end();
      }
    });
};

//connect to my database
connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected at ${connection.threadId}`);
  start();
});
