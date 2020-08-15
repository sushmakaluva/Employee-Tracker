const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Jadcherla.1',
  database: 'employee_tracker_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected successfully');
  startProgram();
});

function startProgram() {

}

