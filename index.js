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

