var inquirer = require("inquirer");
var mysql = require("mysql");
var figlet = require("figlet");
var util = require("util");
var mainPrompt = require("./questions/mainPrompt");

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

      mainMenu();
    }
  );
});

connection.query = util.promisify(connection.query);

function mainMenu() {
  inquirer.prompt(mainPrompt).then(function (res) {
    switch (res.menu) {
      case "View All Employees":
        viewAllEmployee(); // 90% FINISHED
        break;

      case "View All Employees by Department":
        viewAllEmplDept(); // 80% FINISHED
        break;

      case "View All Employees by Manager":
        viewAllEmplMng(); // 50% and NEED TO WORK ON MANAGER_ID // BONUS POINTS
        break;

      case "Add Employee":
        addEmployee(); // 70% FINISHED // ROLE NEEDS CONVERTED INTO ROLE_ID
        break;

      case "Remove Employee":
        deleteEmployee(); // 80% WORKING, NEEDS TO UNDERSTAND WHY
        break;

      case "Update Employee Role": // NOTHING HAS BEEN DONE.
        updateEmplRole();
        break;

      case "Update Employee Manager": // 10%
        updateEmplManager();
        break;

      case "Exit":
        endApp();
        break;
    }
  });
}

////////// Cases
const allEmployeeList = [];

// View All Employee
function viewAllEmployee() {
  var query =
    "SELECT employee.id, first_name, last_name, roles.title, department.name_dept, roles.salary, employee.manager_id";
  query += " FROM roles RIGHT JOIN employee ON employee.role_id = roles.id";
  query += " LEFT JOIN department ON roles.department_id = department.id;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    allEmployeeList.push(res); // pushing all emp to array on top.
    console.log(res);
    for (var i = 0; i < res.length; i++) {
      console.log(
        "id: " +
          res[i].id +
          " || FirstName: " +
          res[i].first_name +
          " || LastName: " +
          res[i].last_name +
          " || Title: " +
          res[i].title +
          " || Department: " +
          res[i].name_dept +
          " || Salary: " +
          res[i].salary +
          "Manager: " +
          res[i].manager_id
      );
    }
    mainMenu();
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
              " || Title: " +
              res[i].title +
              " || Department: " +
              res[i].name_dept +
              " || Salary: " +
              res[i].salary +
              " || Manager: " +
              res[i].manager_id
          );
        }
        mainMenu();
      });
    });
}

async function viewAllEmplMng() {
  // var choicesVar = array.
  // const choicesMng = [];
  // var query =
  //       "SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name_dept, roles.salary,";
  //     query += " CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee";
  //     query += " LEFT JOIN roles  ON employee.role_id = roles.id";
  //     query += " LEFT JOIN department ON roles.department_id = department.id";
  //     query += " LEFT JOIN employee manager ON manager.id = employee.manager_id";
  //     connection.query(query, function (err, res) {
  //       if (err) throw err;
  //       for (var i = 0; i < res.length; i++) {
  //       var managerOnly = res;
  //       var { id, manager } = managerOnly;
  //       choicesMng.push(manager);

  //       }
  //       console.log(res);
  //       console.log(manager);
  //       // console.log(manager[5]);
  //       console.log(choicesMng);
  //     });

  await inquirer
    .prompt({
      name: "manager",
      type: "list",
      message: "Which manager's team do you want to browse?",
      choices: choicesMng,
    })
    .then(function (answer) {
      var query =
        "SELECT employee.id, first_name, last_name, roles.title, department.name_dept, roles.salary,";
      query +=
        " CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee";
      query += " LEFT JOIN roles  ON employee.role_id = roles.id";
      query += " LEFT JOIN department ON roles.department_id = department.id";
      query += " WHERE ?";
      // query += " LEFT JOIN employee manager ON manager.id = employee.manager_id";

      connection.query(query, { manager_id: answer.manager }, function (
        err,
        res
      ) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          console.log(
            "id: " +
              res[i].id +
              " || FirstName: " +
              res[i].first_name +
              " || LastName: " +
              res[i].last_name +
              " || Title: " +
              res[i].title +
              " || Department: " +
              res[i].name_dept +
              " || Salary: " +
              res[i].salary +
              " || Manager: " +
              res[i].manager_id
          );
        }
        mainMenu();
      });
    });
}

function addEmployee() {
  var query =
    "SELECT employee.id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee ";
  query += "LEFT JOIN roles  ON employee.role_id = roles.id ";
  query += "LEFT JOIN department ON roles.department_id = department.id ";
  query += "LEFT JOIN employee manager ON manager.id = employee.manager_id ";
  query += "WHERE employee.manager_id IS NOT NULL GROUP BY manager";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(res);
    const managerChoices = res.map(({ id, manager }) => ({
      name: `${manager}`,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstname",
          message: "What is the employee's first name??",
        },
        {
          type: "input",
          name: "lastname",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "role",
          message: "What is the employee's role?",
          choices: [
            "Sales Lead",
            "Salesperson",
            "Lead Engineer",
            "Software Engineer",
            "Account Manager",
            "Accountant",
            "Legal Team Lead",
            "Lawyer",
          ],
        },
        {
          type: "list",
          name: "manager",
          message: "Who is the employee's manager?",
          choices: managerChoices,
        },
      ])
      .then(function (res) {
        console.log(res.manager);
        console.log(res.role);
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: res.firstname,
            last_name: res.lastname,
            role_id: res.role,
            manager_id: res.manager,
          },
          function (err, res) {
            if (err) throw err;
            console.log(res);
            mainMenu();
          }
        );
      });
  });
}

// GET ALL EMPLOYEES AND STORE IT INTO ARRAY. (CONST employees)
// ANOTHER VARIABLE WITH CHOICES (USE DESTRUCTING)

// const employees = await viewAllEmployees();
// const employeeChoices = employees.map(( {id, first_name, last_name} ) => ({
//   name: `${first_name} ${last_name}`,
//   value: id
// }));

// const { empId } = await prompt([
//   {
//     type: "list",
//     name: "empId",
//     message: "Which employee do you want to remove",
//     choices: employeeChoices
//   },
//   await deleteEmployee(empId),
//   mainPrompt()
// ]);

function deleteEmployee() {
  // USE THIS TO ALL UPDATE FUNCTIONS
  connection.query("SELECT id, first_name, last_name FROM employee", function (
    err,
    res
  ) {
    if (err) throw err;
    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "remove",
          message: "Which employee do you want to remove?",
          choices: employeeChoices,
        },
      ])
      .then(function (res) {
        console.log("whatsthis", res.remove);
        connection.query(
          "DELETE FROM employee WHERE id=?",
          res.remove,
          function (err, res) {
            if (err) throw err;
            mainMenu();
          }
        );
      });
  });
}

function updateEmplRole() {
  var query = connection.query(
    "UPDATE employee SET ? WHERE ?",
    [
      // {
      //   quantity: 100
      // },
      // {
      //   flavor: "Rocky Road"
      // }
    ],
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " products updated!\n");
      mainMenu();
    }
  );
}

function updateEmplManager() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "assign",
        message: "Who is the employee's manager?",
        choices: ["LIST OF MANAGERS HERE"],
      },
    ])
    .then(function (res) {
      var query = connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
          // {
          //   quantity: 100
          // },
          // {
          //   flavor: "Rocky Road"
          // }
        ],
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " products updated!\n");
          mainMenu();
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
