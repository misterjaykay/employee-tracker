var inquirer = require("inquirer");
var mysql = require("mysql");
var figlet = require("figlet");
var util = require("util");
var cTable = require("console.table");

///// MYSQL
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  // password: process.env.MYSQL_KEY,
  password: "password",
  database: "employee_db",
});

///// APPEARING TEXT WHEN START APP
connection.connect(function (err) {
  if (err) throw err;
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

///// MAIN MENU (MAIN PROMPT)
function mainMenu() {
  inquirer
    .prompt([
      {
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
          "Update Employee Manager",
          "Salary Report by Department",
          "Exit",
        ],
      },
    ])
    .then(function (res) {
      switch (res.menu) {
        case "View All Employees":
          viewAllEmployee(); // 90% FINISHED // MANAGER_ID needs to be names when showed.
          break;

        case "View All Employees by Department":
          viewAllEmplDept(); // 80% FINISHED // MANAGER_ID needs to be names when showed.
          break;

        case "View All Employees by Manager":
          initViewAllEmplMng(); // 80% and NEED TO WORK ON MANAGER_ID(NULL) // BONUS POINTS
          // MANAGER ID BECOMES UNDEFINED, NEEDS TO BE NAMES.
          break;

        case "Add Employee":
          // employeeChoices();
          initAddEmployee(); // 70% NOT WORKING // ROLE NEEDS CONVERTED INTO ROLE_ID
          // ROLES NEEDS TO BE WORKED, IT IS CURRENTLY HARD-CODED WHICH WILL NOT WORK.
          break;

        case "Remove Employee":
          deleteEmployee(); // 90% WORKING
          break;

        case "Update Employee Role": // 90% FINISHED, DOUBLE CHECK.
          initUpdateEmplRole();
          break;

        case "Update Employee Manager": // 90% FINISHED, DOUBLE CHECK.
          initUpdateEmplManager();
          break;

        case "Salary Report by Department":
          salaryReport(); // 90% WORKING, ADD IF ANYTHING COMES IN MIND.
          break;

        case "Exit":
          endApp();
          break;
      }
    });
}

///// VIEW ALL EMPLOYEES
function viewAllEmployee() {
  var query =
    "SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name_dept, roles.salary, ";
  query +=
    "CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee ";
  query += "LEFT JOIN employee manager ON employee.manager_id = manager.id ";
  query +=
    "LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON department.id = roles.department_id;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("\n");
    console.table(res);
    console.log("\n");
    mainMenu();
  });
}

///// VIEW ALL EMPLOYEES BY DEPARTMENT
function viewAllEmplDept() {
  const query = "SELECT id, name_dept from department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const deptChoices = res.map(({ id, name_dept }) => ({
      name: `${name_dept}`,
      value: id,
    }));
    inquirer
      .prompt({
        name: "dept",
        type: "list",
        message: "Which department do you want to browse?",
        choices: deptChoices,
      })
      .then(function (answer) {
        var query =
          "SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name_dept, roles.salary, ";
        query +=
          "CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee ";
        query +=
          "LEFT JOIN employee manager ON employee.manager_id = manager.id ";
        query +=
          "LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON department.id = roles.department_id";
        query += " WHERE department_id=?";
        connection.query(query, answer.dept, function (err, res) {
          if (err) throw err;
          console.log("\n");
          console.table(res);
          console.log("\n");
          mainMenu();
        });
      });
  });
}

///// VIEW ALL EMPLOYEES BY MANAGER
function initViewAllEmplMng() {
  var query =
    "SELECT employee.manager_id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager ";
  query +=
    "FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id ";
  query += "WHERE employee.manager_id > 0 GROUP BY manager;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const managerChoices = res.map(({ manager_id, manager }) => ({
      name: `${manager}`,
      value: manager_id,
    }));
    viewAllEmplMng(managerChoices);
  });
}

function viewAllEmplMng(manager) {
  inquirer
    .prompt({
      name: "manager",
      type: "list",
      message: "Which manager's team do you want to browse?",
      choices: manager,
    })
    .then(function (answer) {
      var query =
        "SELECT employee.id, first_name, last_name, roles.title, department.name_dept, roles.salary";
      query += " FROM employee LEFT JOIN roles  ON employee.role_id = roles.id";
      query += " LEFT JOIN department ON roles.department_id = department.id";
      query += " WHERE ?";

      connection.query(query, { manager_id: answer.manager }, function (
        err,
        res
      ) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        console.log("\n");
        mainMenu();
      });
    });
}

///// ADDING EMPLOYEE
function initAddEmployee() {
  var query =
    "SELECT employee.manager_id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee ";
  query += "LEFT JOIN employee manager ON manager.id = employee.manager_id ";
  query += "GROUP BY manager";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const managerChoices = res.map(({ id, manager }) => ({
      name: `${manager}`,
      value: id,
    }));
    addEmployee(managerChoices);
  });
}

function addEmployee(manager) {
  const query = "SELECT roles.id, roles.title FROM roles;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const roleChoices = res.map(({ id, title }) => ({
      name: `${title}`,
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
          choices: roleChoices,
        },
        {
          type: "list",
          name: "manager",
          message: "Who is the employee's manager?",
          choices: manager,
        },
      ])
      .then(function (res) {
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
            mainMenu();
          }
        );
      });
  });
}

///// DELETING EMPLOYEE
function deleteEmployee() {
  const query = "SELECT id, first_name, last_name FROM employee";
  connection.query(query, function (err, res) {
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

///// UPDATING EMPLOYEE ROLE
function initUpdateEmplRole() {
  const query = "SELECT id, first_name, last_name FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    updateEmplRole(employeeChoices);
  });
}

function updateEmplRole(employee) {
  const query = "SELECT roles.id, roles.title FROM roles;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const roleChoices = res.map(({ id, title }) => ({
      name: `${title}`,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "select",
          message: "Please select which employee you want to update.",
          choices: employee,
        },
        {
          type: "list",
          name: "newrole",
          message: "What is the employee's new role?",
          choices: roleChoices,
        },
      ])
      .then(function (res) {
        connection.query(
          "UPDATE employee SET? WHERE ?",
          [
            {
              role_id: res.newrole,
            },
            {
              id: res.select,
            },
          ],
          function (err, res) {
            if (err) throw err;

            mainMenu();
          }
        );
      });
  });
}

///// UPDATING EMPLOYEES ASSIGNED MANAGER
function initUpdateEmplManager() {
  const query = "SELECT id, first_name, last_name FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    updateEmplManager(employeeChoices);
  });
}

function updateEmplManager(employee) {
  var query =
    "SELECT employee.manager_id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager ";
  query +=
    "FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id ";
  query += "WHERE employee.manager_id > 0 GROUP BY manager;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const managerChoices = res.map(({ manager_id, manager }) => ({
      name: `${manager}`,
      value: manager_id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "select",
          message: "Please select which employee you want to update.",
          choices: employee,
        },
        {
          type: "list",
          name: "newmanager",
          message: "What is the employee's new manager?",
          choices: managerChoices,
        },
      ])
      .then(function (res) {
        connection.query(
          "UPDATE employee SET ? WHERE ?",
          [
            {
              manager_id: res.newmanager,
            },
            {
              id: res.select,
            },
          ],
          function (err, res) {
            if (err) throw err;
            mainMenu();
          }
        );
      });
  });
}

///// SALARY REPORT BY DEPARTMENT
function salaryReport() {
  const query = "SELECT id, name_dept from department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const deptChoices = res.map(({ id, name_dept }) => ({
      name: `${name_dept}`,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "report",
          message:
            "Which department of combined salaries do you want to browse?",
          choices: deptChoices,
        },
      ])
      .then(function (res) {
        var query =
          "SELECT SUM(roles.salary) total_salary, department.name_dept FROM employee ";
        query += "LEFT JOIN roles ON employee.role_id = roles.id ";
        query += "LEFT JOIN department ON roles.department_id = department.id ";
        query += "WHERE department.id =?";

        connection.query(query, res.report, function (err, res) {
          if (err) throw err;
          console.table(res);
          mainMenu();
        });
      });
  });
}

///// ENDING APP
function endApp() {
  figlet.text(
    "Thanks for \n Using App \n Goodbye!",
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
    }
  );
  connection.end();
}
