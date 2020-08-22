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

// List of department
// Sales Engineering Finance Legal

// id first last title dept salary manager

function init() {
  inquirer.prompt(mainPrompt).then(function (res) {
    switch (res.menu) {
      case "View All Employees":
        viewAllEmployee(); // 90% FINISHED
        break;

      case "View All Employees by Department":
        viewAllEmplDept();
        console.log("2");
        break;

      case "View All Employees by Manager":
        viewAllEmplMng();
        console.log("3");
        break;

      case "Add Employee":
        console.log("4");
        funcAddInfo();
        break;

      case "Remove Employee":
        console.log("5");
        break;

      case "Update Employee Role":
        console.log("6");
        break;

      case "Update Employee Manager":
        console.log("7");
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
  connection.query(
    "SELECT * FROM employee RIGHT JOIN employee ON department.name_dept = name_dept",
    function (err, res) {
      if (err) throw err;
      console.log(res);
    }
  );
}

function funcAddInfo() {
  inquirer.prompt(addInfo).then(function (res) {
    connection.query(
      "INSERT INTO employee SET?",
      {
        first_name: res.firstname,
        last_name: res.lastname,
        role: res.role,
        // manager_id:
      },
      function (err, res) {
        if (err) throw err;
        console.log(res);
        connection.end(); // on end of query
      }
    );
  });
}
