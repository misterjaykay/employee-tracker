
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