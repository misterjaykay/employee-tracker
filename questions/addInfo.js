const addInfo = [
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
      type: "input",
      name: "role",
      message: "What is the employee's role?",
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: ["LIST OF MANAGERS HERE"],
    },
  ];

  module.exports = addInfo;