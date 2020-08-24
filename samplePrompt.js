const inquirer = require("inquirer");

function test() {
inquirer
.prompt(questions)
.then(function (res){
  console.log(res);
})
}
var questions = [
  {
    type: "list",
    name: "databasetype",
    message: "Choose database :",
    choices: ["mongoDB", "mysql [alpha]", "firebase [alpha]", "url [alpha]"],
    default: "mongoDB",
  },
  {
    type: "input",
    name: "url",
    message: "Enter the URL",
    // when: (answers) => answers.databasetype === "mongoDB",
    when: function (answers) {  
      if (answers.databasetype === "mongoDB") {
        console.log("whatever");
      }
    }
  },
];

test();

function deleteEmployee(empId) {

  connection.query("SELECT id, first_name, last_name FROM employee", 
  function(err, res) {
    if (err) throw err;
    const employeeChoices = res.map(( {id, first_name, last_name} ) => ({
    name: `${first_name} ${last_name}`,
    value: id
    }));

  inquirer
    .prompt([
      {
        type: "list",
        name: "remove",
        message: "Which employee do you want to remove?",
        choices: employeeChoices
      },
    ])
    .then(function (res) {
      connection.query(
        // `DELETE FROM employee WHERE id=?`
        "DELETE FROM employee WHERE id=?",
        empId,
        function (err, res) {
          if (err) throw err;
          console.log(res);
          mainMenu();
        }
      );
    });
  });
}