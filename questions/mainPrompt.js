const mainPrompt = {
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
      "Exit"
    ],
  };

module.exports = mainPrompt; 