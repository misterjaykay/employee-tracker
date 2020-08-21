var inquirer = require("inquirer");
var mysql = require("mysql");
var fs = require("fs");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "employee_db",
});

connection.connect(function(err) {
    if (err) throw err; // on each connection query
    console.log("connected as id " + connection.threadId + "\n");
    afterConnection();

});

function afterConnection() {
    connection.query("SELECT * FROM songs", function (err, res) {
      if (err) throw err;
      console.log(res);
      connection.end(); // on end of query
    });
}

//questions
const mainPrmpt = {
    type: "list",
    name: "menu",
    message: "What would you like to do?",
    choices: [
    "View All Employees",
    "View All Employees by Department",
    "View All Employees by Manager",
    "Add Employee",
    "Remove Employee",
    "Update Employee Role",
    "Update Employee Manager"
    ]
};

const addInfo = [
    {
        type: "input",
        name: "firstname",
        message: "What is the employee's first name??"
    },
    {
        type: "input",
        name: "lastname",
        message: "What is the employee's last name?"
    },
    {
        type: "input",
        name: "role",
        message: "What is the employee's role?"
    },
    {
        type: "input",
        name: "manager",
        message: "Who is the employee's manager?"
    }
];

const askRemove = {
    type: "list",
    name: "remove",
    message: "Which employee do you want to remove?",
    choices: ["LIST OF EMPLOYEES HERE"]
}

const askRole = {
    type: "list",
    name: "main",
    message: "What is the employee's role?",
    choices: [
        "Sales Lead",
        "Salesperson",
        "Lead Engineer",
        "Software Engineer",
        "Account Manager",
        "Accountant",
        "Legal Team Lead",
        "Lawyer"
    ]
}

const assignManager = {
    type: "list",
    mane: "assign",
    message: "Who is the employee's manager?",
    choices: ["LIST OF MANAGERS HERE"]
}

// List of department
// Sales Engineering Finance Legal

function init() {
    inquirer
    .prompt(mainPrmpt)
    .then(function(res) {
        console.log('results',res);
        switch(res.menu) {
            case "View All Employees":
                console.log("1")
                // function here 
                break;
            case "View All Employees by Department":
                console.log("2")
                // function
                break;
            case "View All Employees by Manager":
                console.log("3")
                // function
                break;
            case "Add Employee":
                console.log("4")
                // function
                break;
            case "Remove Employee":
                console.log("5")
                // function
                break;
            case "Update Employee Role":
                console.log("6")
                // function
                break;
            case "Update Employee Manager":
                console.log("7")
                // function
                break;
        }
    });
}

init();

  
  