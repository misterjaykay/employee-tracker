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
        deleteEmployee(); // 80% WORKING, NEEDS TO UNDERSTAND WHY
        // JUST NEED TO CLEAN CONSOLE LOGS.
        break;

      case "Update Employee Role": // 90% FINISHED, DOUBLE CHECK.
        initUpdateEmplRole();
        // updateEmplRole();
        break;

      case "Update Employee Manager": // 90% FINISHED, DOUBLE CHECK.
        initUpdateEmplManager();
        // updateEmplManager();
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
    "SELECT employee.id, first_name, last_name, roles.title, department.name_dept, roles.salary, employee.manager_id";
  query += " FROM roles RIGHT JOIN employee ON employee.role_id = roles.id";
  query += " LEFT JOIN department ON roles.department_id = department.id;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(res);
    function Employee(id, first, last, title, dept, salary, manager) {
      this.id = id;
      this.first_name = first;
      this.last_name = last;
      this.title = title;
      this.name_dept = dept;
      this.salary = salary;
      this.manager_id = manager;
    }

    var newArr = [];
    for (var i = 0; i < res.length; i++) {
      var list = new Employee(
        res[i].id,
        res[i].first_name,
        res[i].last_name,
        res[i].title,
        res[i].name_dept,
        res[i].salary,
        res[i].manager_id
      );
      newArr.push(list);
    }
    console.table(newArr);
    mainMenu();
  });
}

///// VIEW ALL EMPLOYEES BY DEPARTMENT
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
        function Employee(id, first, last, title, dept, salary, manager) {
          this.id = id;
          this.first_name = first;
          this.last_name = last;
          this.title = title;
          this.name_dept = dept;
          this.salary = salary;
          this.manager_id = manager;
        }

        var newArr = [];
        for (var i = 0; i < res.length; i++) {
          var list = new Employee(
            res[i].id,
            res[i].first_name,
            res[i].last_name,
            res[i].title,
            res[i].name_dept,
            res[i].salary,
            res[i].manager_id
          );
          newArr.push(list);
        }
        console.table(newArr);
        mainMenu();
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
      choices: manager
    })
    .then(function (answer) {
      var query =
        "SELECT employee.id, first_name, last_name, roles.title, department.name_dept, roles.salary";
      query += " FROM employee LEFT JOIN roles  ON employee.role_id = roles.id";
      query += " LEFT JOIN department ON roles.department_id = department.id";
      query += " WHERE ?";
      // query += " LEFT JOIN employee manager ON manager.id = employee.manager_id";

      connection.query(query, { manager_id: answer.manager }, function (
        err,
        res
      ) {
        if (err) throw err;
        function Employee(id, first, last, title, dept, salary, manager) {
          this.id = id;
          this.first_name = first;
          this.last_name = last;
          this.title = title;
          this.name_dept = dept;
          this.salary = salary;
          this.manager_id = manager;
        }

        var newArr = [];
        for (var i = 0; i < res.length; i++) {
          var list = new Employee(
            res[i].id,
            res[i].first_name,
            res[i].last_name,
            res[i].title,
            res[i].name_dept,
            res[i].salary,
            res[i].manager_id
          );
          newArr.push(list);
        }
        console.table(newArr);
        mainMenu();
      });
    });
}

// const result = await employeeChoices();
function initAddEmployee() {
  var query =
    "SELECT employee.id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee ";
  query += "LEFT JOIN roles  ON employee.role_id = roles.id ";
  query += "LEFT JOIN department ON roles.department_id = department.id ";
  query += "LEFT JOIN employee manager ON manager.id = employee.manager_id ";
  query += "WHERE employee.manager_id IS NOT NULL GROUP BY manager";
  connection.query(query, function (err, res) {
    if (err) throw err;
    // console.log(res);
    const managerChoices = res.map(({ id, manager }) => ({
      name: `${manager}`,
      value: id,
    }));
    addEmployee(managerChoices);
  });
}

function addEmployee(res) {
  // const result = await employeeChoices();
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
        choices: res,
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

///// DELETE EMPLOYEE
function deleteEmployee() {
  // USE THIS TO ALL UPDATE FUNCTIONS
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

///// UPDATE EMPLOYEE ROLE
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
        console.log("whats this", res);
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
            console.log("completed");
            mainMenu();
          }
        );
      });
  });
}

///// UPDATE EMPLOYEE MANAGER
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

/// Need to assign manager's employee id on employees.
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
        console.log(res);
        var query = connection.query(
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
            console.log(res.affectedRows + " products updated!\n");
            mainMenu();
          }
        );
      });
  });
}

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
