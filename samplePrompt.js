questions = [
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
    when: (answers) => answers.databasetype === "mongoDB",
  },
];
