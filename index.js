var inquirer = require("inquirer");
var mysql = require("mysql");
var figlet = require('figlet');
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

  figlet.text('Welcome To \n Employee \n Manager v1.0', {
    horizontalLayout: 'default',
    verticalLayout: 'full',
    width: 80,
    whitespaceBreak: true
  }, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log("-----------------------------------------------------------------");
    console.log(data);
    console.log("-----------------------------------------------------------------");
    console.log("\n");
    
    init();
  });
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
  inquirer
  // .prompt(mainPrompt)
  .prompt(addInfo)
  .then(function (res) {
    console.log("results", res);
    switch (res.menu) {
      case "View All Employees":
        console.log("1");
        viewAllEmployee();
        // function
        break;
      case "View All Employees by Department":
        viewAllEmplDept();
        console.log("2");
        // function
        break;
      case "View All Employees by Manager":
        viewAllEmplMng();
        console.log("3");
        // function
        break;
      case "Add Employee":
        console.log("4");
        funcAddInfo();
        // function
        break;
      case "Remove Employee":
        console.log("5");
        // function
        break;
      case "Update Employee Role":
        console.log("6");
        // function
        break;
      case "Update Employee Manager":
        console.log("7");
        // function
        break;
    }
  });
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

function viewAllEmployee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.log(res);
  });
}

function viewAllEmplDept() {
  connection.query("SELECT * FROM department RIGHT JOIN employee ON department.name_dept = name_dept", 
  function (err, res) {
    if (err) throw err;
    console.log(res);
  });
}

function viewAllEmplMng() {
  connection.query("SELECT * FROM employee RIGHT JOIN employee ON department.name_dept = name_dept", 
  function (err, res) {
    if (err) throw err;
    console.log(res);
  });
}
