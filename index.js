var inquirer = require("inquirer");
var mysql = require("mysql");
const { lavender } = require("color-name");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "playlist_db",
  });

//questions
const mainPrmpt = {
    type: "list",
    name: "main",
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
        name: "main",
        message: "What is the employee's first name??"
    },
    {
        type: "input",
        name: "main",
        message: "What is the employee's last name?"
    },
    {
        type: "input",
        name: "main",
        message: "What is the employee's role?"
    },
    {
        type: "input",
        name: "main",
        message: "Who is the employee's manager?"
    }
];

const askRemove = {
    type: "list",
    name: "main",
    message: "Which employee do you want to remove?",
    choices: ["LIST OF EMPLOYEES HERE"]
}

const askRole = {
    type: "list",
    name: "main",
    message: "Which employee do you want to remove?",
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

// List of department
// Sales Engineering Finance Legal

function init() {
    inquirer
    .prompt(mainPrmpt)
    .then(function(res) {
        console.log('results',res);
        switch(res) {
            case "View All Employees":
                // function here
                break;
            case "View All Employees by Department":
                // function
                break;
            case "View All Employees by Manager":
                // function
                break;
            case "Add Employee":
                // function
                break;
            case "Remove Employee":
                // function
                break;
            case "Update Employee Role":
                // function
                break;
            case "Update Employee Manager":
                // function
                break;
        }
    });
}

init();

  
  
  
  

    
