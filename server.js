const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const mysql = require("mysql");
const inquirer = require("inquirer");

//connection information
const connection = mysql.createConnection({
  host: "localhost",
  PORT: 3306,
  user: "root",
  password: "root",
  database: "employee_cms_db",
});

const viewAllEmployees = () => {
    connection.query("SELECT * FROM emp")
}

const mainMenu = () => {
  console.log(
    chalk.yellow(figlet.textSync("Employee", { horizontalLayout: "full" }))
  );
  console.log(
    chalk.yellow(figlet.textSync("Manager", { horizontalLayout: "full" }))
  );
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do? ",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
      ],
      name: "main",
    })
    .then(({ main }) => {
      console.log(main);
      switch (main) {
        case "View All Employees":
          console.log("View All Employees selected");
          return viewAllEmployees();
        case "View All Employees By Department":
          console.log("View All Employees By Department selected");
      }
    });
};

//connect to my database
connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected at ${connection.threadId}`);
  mainMenu();
});
