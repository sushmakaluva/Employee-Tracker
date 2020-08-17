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
  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'What is the employees first name?',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'What is the employees last name?',
      },
      {
        name: 'employee_role',
        type: 'list',
        message: 'What is the employees role?',
        choices: ['Salesperson', 'Software Engineer', 'Sales Lead', 'Lead Engineer', 'Accountant', 'Finance Lead'],
      },
      {
        name: 'employee_manager',
        type: 'list',
        message: 'Who is the employees manager?',
        choices: ['None', 'Ashley Rodriguez', 'Christian Eckenrode', 'John Doe', 'Mike Chan', 'Malia Brown', 'Tom Allen ', 'Kevin Tupik', 'Sarah Lourd'],
      },
    ])
    .then((answer) => {
      const query4 = '';
      connection.query(query4, [answer.first_name, answer.last_name, answer.employee_role, answer.employee_manager], (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
      });
    });
}

function removeEmployee() {
  inquirer
    .prompt([
      {
        name: 'employee_name',
        type: 'list',
        message: 'Which employee you would like to remove?',
        choices: [],
      },
    ])
    .then((answer) => {
      const answer2 = answer.split(' ');
      const query5 = 'DELETE FROM employee where employee.first_name=? and employee.last_name=?;';
      connection.query(query5, [answer2[0].employee_name, answer2[1].employee_name], (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
      });
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: 'employee_name',
        type: 'list',
        message: 'Which employees role you would like to update ?',
        choices: [],
      },
      {
        name: 'employee_role',
        type: 'list',
        message: 'What is the role you would like to update to ?',
        choices: [],
      },
    ])
    .then((answer) => {
      const query6 = 'update employee set employee.role_id=? where employee.first_name=? and employee.last_name=?';
      connection.query(query6, [answer.employee_name, answer.employee_role](err, res) => {
        if(err) throw err;
        console.table(res);
        startProgram();
      });
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
  inquirer
    .prompt([
      {
        name: 'role_title',
        type: 'input',
        message: 'Which role would you like to add ?',
      },
      {
        name: 'role_salary',
        type: 'input',
        message: 'Enter the salary for the role?',
      },
      {
        name: 'role_department_id',
        type: 'list',
        message: 'Which department the role is under?',
        choices: [],
      },

    ])
    .then((answer) => {
      const query8 = 'insert into role (title,salary,department_id) values(?,?,?);';
      connection.query(query8, [answer.role_title, answer.role_salary, answer.role_department_id], (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
      });
    });
}

function removeRole() {
  inquirer
    .prompt([
      {
        name: 'role',
        type: 'list',
        message: 'Which role would you like to remove?',
        choices: [],
      },
    ])
    .then((answer) => {
      const query9 = 'delete from role where role.title=?;';
      connection.query(query9, [answer.role], (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
      });
    });
}
