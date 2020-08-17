const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

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
  inquirer.prompt({
    type: 'list',
    message: 'What you would like to do?',
    name: 'action',
    choices: [
      'View all employees',
      'View all employees by department',
      'View all employees by manager',
      'Add employee',
      'Remove employee',
      'Update employee role',
      'Update employee manager',
      'View all roles',
      'Add role',
      'Remove role',
      'exit',
    ],
  })
    .then((answer) => {
      switch (answer.action) {
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'View all employees by department':
          viewAllEmployeesByDepart();
          break;
        case 'View all employees by manager':
          viewAllEmployeesByManager();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Remove employee':
          removeEmployee();
          break;
        case 'Update employee role':
          updateEmployeeRole();
          break;
        case 'Update employee manager':
          updateEmployeeManager();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'Add role':
          addRole();
          break;
        case 'Remove role':
          removeRole();
          break;
        case 'exit':
          exit();
          break;
        default:
          exit();
      }
    });
}

function exit() {
  connection.end();
}

function viewAllEmployees() {
  const query1 = `SELECT employee.id, employee.first_name, employee.last_name,role.title as role, department.name as department, role.salary, concat(m.first_name, ' ',m.last_name) as manager 
  FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON(department.id = role.department_id)
  LEFT JOIN employee m on(employee.id = m.manager_id)`;
  connection.query(query1, (err, res) => {
    if (err) throw err;
    console.table(res);
    startProgram();
  });
}

function viewAllEmployeesByDepart() {
  const query2 = `select concat(employee.first_name,' ',employee.last_name) as Employee,department.name as Department
  FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (department.id = role.department_id) group by Department, Employee;`;
  connection.query(query2, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptDepartment();
  });
}

function promptDepartment() {
  inquirer
    .prompt({
      name: 'department',
      type: 'input',
      message: 'Which department employees would you like to see?',
    })
    .then((answer) => {
      const query = `select concat(employee.first_name,' ',employee.last_name) as Employee, department.name as Department
      FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (department.id = role.department_id) where department.name=?`;
      connection.query(query, [answer.department], (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
      });
    });
}

function viewAllEmployeesByManager() {
  const query3 = `select concat(employee.first_name,' ',employee.last_name) as Employee, concat(m.first_name,' ',m.last_name) as Manager
  FROM employee LEFT JOIN employee m on (employee.id = m.manager_id) order by Employee;`;
  connection.query(query3, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptManager();
  });
}

function promptManager() {
  inquirer
    .prompt({
      name: 'employee_name',
      type: 'input',
      message: 'Which employees manager would you like to see?',
    })
    .then((answer) => {
      const query = `select concat(employee.first_name,' ',employee.last_name) as Employee, concat(m.first_name,' ',m.last_name) as Manager
      FROM employee LEFT JOIN employee m on (employee.id = m.manager_id) where employee.first_name=?`;
      connection.query(query, [answer.employee_name, answer.employee_name], (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
      });
    });
}

function addEmployee() {
  const query4 = '';
  connection.query(query4, (err, res) => {
    if (err) throw err;
    console.table(res);
    startProgram();
  });
}

function removeEmployee() {
  const query5 = '';
  connection.query(query5, (err, res) => {
    if (err) throw err;
    console.table(res);
    startProgram();
  });
}

function updateEmployeeRole() {
  const query6 = '';
  connection.query(query6, (err, res) => {
    if (err) throw err;
    console.table(res);
    startProgram();
  });
}

function viewAllRoles() {
  const query7 = 'select id,title as Roles from role';
  connection.query(query7, (err, res) => {
    if (err) throw err;
    console.table(res);
    startProgram();
  });
}

function addRole() {
  const query8 = '';
  connection.query(query8, (err, res) => {
    if (err) throw err;
    console.table(res);
    startProgram();
  });
}

function removeRole() {
  const query9 = '';
  connection.query(query9, (err, res) => {
    if (err) throw err;
    console.table(res);
    startProgram();
  });
}
