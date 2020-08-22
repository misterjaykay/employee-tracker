var inquirer = require("inquirer");
var mysql = require("mysql");
var figlet = require("figlet");
var mainPrompt = require("./questions/mainPrompt");
var addInfo = require("./questions/addInfo");
// var fs = require("fs");

///// MYSQL
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_db",
});

///// APPEARING TEXT WHEN START APP
connection.connect(function (err) {
  if (err) throw err; // on each connection query
  console.log("connected as id " + connection.threadId + "\n");

  figlet.text(
    "Welcome To \n Employee \n Manager v1.0",
    {
      horizontalLayout: "default",
      verticalLayout: "full",
      width: 80,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(
        "-----------------------------------------------------------------"
      );
      console.log(data);
      console.log(
        "-----------------------------------------------------------------"
      );
      console.log("\n");

      init();
    }
  );
});

//questions
const askRemove = {
  type: "list",
  name: "remove",
  message: "Which employee do you want to remove?",
  choices: ["LIST OF EMPLOYEES HERE"],
};

const assignManager = {
  type: "list",
  mane: "assign",
  message: "Who is the employee's manager?",
  choices: ["LIST OF MANAGERS HERE"],
};

function init() {
  inquirer.prompt(mainPrompt).then(function (res) {
    switch (res.menu) {
      case "View All Employees":
        viewAllEmployee(); // 90% FINISHED
        break;

      case "View All Employees by Department":
        viewAllEmplDept(); // 80% FINISHED
        break;

      case "View All Employees by Manager":
        viewAllEmplMng(); // 50% and NEED TO WORK ON MANAGER_ID
        break;

      case "Add Employee":
        addEmployee(); // 50% FINISHED
        break;

      case "Remove Employee":
        deleteEmployee(); // NOT WORKING, NEEDS WORK ON PULLING LIST OF EMPLOYEES
        break;

      case "Update Employee Role":
        console.log("6");
        break;

      case "Update Employee Manager":
        console.log("7");
        break;

      case "Exit":
        endApp();
        break;

    }
  });
}

////////// Cases
// View All Employee
function viewAllEmployee() {
  var query =
    "SELECT employee.id, first_name, last_name, roles.title, department.name_dept, roles.salary, employee.manager_id";
  query += " FROM roles RIGHT JOIN employee ON employee.role_id = roles.id";
  query += " LEFT JOIN department ON roles.department_id = department.id;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(
        "id: " +
          res[i].id +
          " || FirstName: " +
          res[i].first_name +
          " || LastName: " +
          res[i].last_name +
          "Title: " +
          res[i].title +
          " || Department: " +
          res[i].name_dept +
          " || Salary: " +
          res[i].salary +
          "Manager: " +
          res[i].manager_id
      );
    }
    init();
  });
}

function viewAllEmplDept() {
  inquirer
    .prompt({
      name: "dept",
      type: "list",
      message: "Which department do you want to browse?",
      choices: ["Sales", "Engineering", "Finance", "Legal"],
    })
    .then(function (answer) {
      var query =
        "SELECT employee.id, first_name, last_name, roles.title, department.name_dept, roles.salary, employee.manager_id";
      query += " FROM roles RIGHT JOIN employee ON employee.role_id = roles.id";
      query += " LEFT JOIN department ON roles.department_id = department.id";
      query += " WHERE ?";
      // query += " WHERE department.name_dept = "

      connection.query(query, { name_dept: answer.dept }, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          console.log(
            "id: " +
              res[i].id +
              " || FirstName: " +
              res[i].first_name +
              " || LastName: " +
              res[i].last_name +
              "Title: " +
              res[i].title +
              " || Department: " +
              res[i].name_dept +
              " || Salary: " +
              res[i].salary +
              "Manager: " +
              res[i].manager_id
          );
        }
        init();
      });
    });
}

function viewAllEmplMng() {
  inquirer
    .prompt({
      name: "manager",
      type: "list",
      message: "Which manager's team do you want to browse?",
      choices: ["Managers ARE LISTED HERE"],
    })
    .then(function (answer) {
      var query =
        "SELECT employee.id, first_name, last_name, roles.title, department.name_dept, roles.salary, employee.manager_id";
      query += " FROM roles RIGHT JOIN employee ON employee.role_id = roles.id";
      query += " LEFT JOIN department ON roles.department_id = department.id";
      query += " WHERE ?";

      connection.query(query, { manager_id: answer.manager }, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          console.log(
            "id: " +
              res[i].id +
              " || FirstName: " +
              res[i].first_name +
              " || LastName: " +
              res[i].last_name +
              "Title: " +
              res[i].title +
              " || Department: " +
              res[i].name_dept +
              " || Salary: " +
              res[i].salary +
              "Manager: " +
              res[i].manager_id
          );
        }
        init();
      });
    });
}

function addEmployee() {
  inquirer
  .prompt(addInfo)
  .then(function (res) {
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: res.firstname,
        last_name: res.lastname,
        role_id: res.role,
        manager_id: res.manager
      },
      function (err, res) {
        if (err) throw err;
        console.log(res);
        init();
      }
    );
  });
}

function deleteEmployee() {
  inquirer
  .prompt(addInfo)
  .then(function (res) {
    connection.query(
      "DELETE FROM employee WHERE ?",
      {
        first_name: res.firstname,
        last_name: res.lastname,
      },
      function (err, res) {
        if (err) throw err;
        console.log(res);
        init();
      }
    );
  });
}

function endApp() {
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log("Thanks for using Employee Manager v1.0");
  console.log(
    "-----------------------------------------------------------------"
  );
  connection.end();
} 