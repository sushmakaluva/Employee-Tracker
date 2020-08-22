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

// ---------------- View all employees --------------------------------------
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
// --------------------------------------------------------------------------

// ---------------- View employees by department -------------------------------------
function viewAllEmployeesByDepart() {
  const query2 = `select department.id,department.name
  FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (department.id = role.department_id) group by department.id,department.name;`;
  connection.query(query2, (err, res) => {
    if (err) throw err;
    const departmentChoices = res.map((data) => ({
      value: data.id, name: data.name,
    }));
    // console.table(res);
    // console.log(departmentChoices);
    promptDepartment(departmentChoices);
  });
}

function promptDepartment(departmentChoices) {
  inquirer
    .prompt({
      name: 'department_id',
      type: 'list',
      message: 'Which department employees would you like to see?',
      choices: departmentChoices,
    })
    .then((answer) => {
      const query = `select concat(employee.first_name,' ',employee.last_name) as Employee, department.name as Department
      FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (department.id = role.department_id) where department.id=?`;
      connection.query(query, [answer.department_id], (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
      });
    });
}
// -----------------------------------------------------------------------------------

// ---------------- View employees by manager ----------------------------
function viewAllEmployeesByManager() {
  const query3 = 'select employee.id, employee.first_name,employee.last_name FROM employee;';
  connection.query(query3, (err, res) => {
    if (err) throw err;
    const managerChoices = res.map((data) => ({
      value: data.id, name: `${data.first_name} ${data.last_name}`,
    }));
    // console.table(res);
    // console.log(managerChoices);
    promptManager(managerChoices);
  });
}

function promptManager(managerChoices) {
  inquirer
    .prompt({
      name: 'id',
      type: 'list',
      message: 'Which employees manager would you like to see?',
      choices: managerChoices,
    })
    .then((answer) => {
      // console.log(answer);
      const query = `select concat(employee.first_name,' ',employee.last_name) as Employee, concat(m.first_name,' ',m.last_name) as Manager
      FROM employee LEFT JOIN employee m on (employee.id = m.manager_id) where employee.id=?`;
      connection.query(query, [answer.id], (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
      });
    });
}
// -----------------------------------------------------------------------

// ---------------- Add employee -----------------------------------------------------
function addEmployee() {
  const query2 = 'select role.id, role.title FROM role;';
  connection.query(query2, (err, res) => {
    if (err) throw err;
    const roleChoices = res.map((data) => ({
      value: data.id, name: data.title,
    }));
    const query3 = 'select employee.id, employee.first_name,employee.last_name FROM employee;';
    connection.query(query3, (err1, res1) => {
      if (err1) throw err1;
      const managerChoices = res1.map((data) => ({
        value: data.id, name: `${data.first_name} ${data.last_name}`,
      }));
      getFirstLastNameRole(roleChoices, managerChoices);
    });
  });
}
function getFirstLastNameRole(roleChoices, managerChoices) {
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
        choices: roleChoices,
      },
      {
        name: 'employee_manager',
        type: 'list',
        message: 'Who is he/she a manager to?',
        choices: managerChoices,
      },
    ])
    .then((answer) => {
      const query4 = 'INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES(?,?,?,?);';
      connection.query(query4,
        [answer.first_name, answer.last_name, answer.employee_role, answer.employee_manager],
        (err, res) => {
          if (err) throw err;
          console.table(res);
          startProgram();
        });
    });
}
// -----------------------------------------------------------------------------------

// ---------------- Remove employee --------------------------------------
function removeEmployee() {
  const query = 'select employee.id, employee.first_name,employee.last_name FROM employee;';
  connection.query(query, (err, res) => {
    if (err) throw err;
    const EmployeeChoices = res.map((data) => ({
      value: data.id, name: `${data.first_name} ${data.last_name}`,
    }));
    // console.table(res);
    // console.log(EmployeeChoices);
    promptEmployee(EmployeeChoices);
  });
}

function promptEmployee(EmployeeChoices) {
  inquirer
    .prompt([
      {
        name: 'employee_id',
        type: 'list',
        message: 'Which employee you would like to remove?',
        choices: EmployeeChoices,
      },
    ])
    .then((answer) => {
      const query5 = 'DELETE FROM employee where employee.id=?;';
      connection.query(query5, [answer.employee_id], (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
      });
    });
}
// ------------------------------------------------------------------------

// ----------------Update Employee role ----------------------------------------------------

function updateEmployeeRole() {
  const query1 = 'select employee.id, employee.first_name,employee.last_name FROM employee;';
  connection.query(query1, (err, res) => {
    if (err) throw err;
    const employeeChoices = res.map((data) => ({
      value: data.id, name: `${data.first_name} ${data.last_name}`,
    }));
    getName(employeeChoices);
  });
}

function getName(employeeChoices) {
  inquirer
    .prompt(
      {
        name: 'employee_id',
        type: 'list',
        message: 'Which employees role you would like to update ?',
        choices: employeeChoices,
      },
    )
    .then((answer) => {
      getRole(answer.employee_id);
    });
}

function getRole(employeeId) {
  const query2 = 'select role.id, role.title FROM role;';
  connection.query(query2, (err, res) => {
    if (err) throw err;
    const roleChoices = res.map((data) => ({
      value: data.id, name: data.title,
    }));
    promptRoleUpdate(roleChoices, employeeId);
  });
}

function promptRoleUpdate(roleChoices, employeeId) {
  inquirer
    .prompt(
      {
        name: 'role_id',
        type: 'list',
        message: 'What is the role you would like to update to ?',
        choices: roleChoices,
      },
    )
    .then((answer) => {
      const query6 = 'update employee set employee.role_id=? where employee.id=?';
      connection.query(query6, [answer.role_id, employeeId], (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
      });
    });
}
//-----------------------------------------------------------------------------------------

// ----------------Update Employee manager ----------------------------------------------------
function updateEmployeeManager() {
  const query1 = 'select employee.id, employee.first_name,employee.last_name FROM employee;';
  connection.query(query1, (err, res) => {
    if (err) throw err;
    const employeeChoices = res.map((data) => ({
      value: data.id, name: `${data.first_name} ${data.last_name}`,
    }));
    inquirer
      .prompt(
        {
          name: 'employee_id',
          type: 'list',
          message: 'Manager name?',
          choices: employeeChoices,
        })
      .then((answer) => {
        sendManager(employeeChoices, answer.employee_id);
      });
  });
}

function sendManager(employeeChoices, employeeId) {
  inquirer
    .prompt(
      {
        name: 'manager_id',
        type: 'list',
        message: 'Employee name?',
        choices: employeeChoices,
      },
    )
    .then((answer) => {
      const query6 = 'update employee set employee.manager_id=? where employee.id=?';
      connection.query(query6, [answer.manager_id, employeeId], (err1, res1) => {
        if (err1) throw err1;
        console.table(res1);
        startProgram();
      });
    });
}
//-----------------------------------------------------------------------------------------

// ---------------- View all roles ----------------------------------------
function viewAllRoles() {
  const query7 = 'select role.id,role.title as Role,role.salary,department.name as department from role left join department on (role.department_id=department.id)';
  connection.query(query7, (err, res) => {
    if (err) throw err;
    console.table(res);
    startProgram();
  });
}
// ------------------------------------------------------------------------

// ----------------Add role -----------------------------------------------------------------
function addRole() {
  const query = `select department.id,department.name
  FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (department.id = role.department_id) group by department.id,department.name;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const departmentChoices = res.map((data) => ({
      value: data.id, name: data.name,
    }));
    sendDepartment(departmentChoices);
  });
}
function sendDepartment(departmentChoices) {
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
        choices: departmentChoices,
      },

    ])
    .then((answer) => {
      const query8 = 'insert into role (title,salary,department_id) values(?,?,?);';
      connection.query(query8, [answer.role_title, answer.role_salary, answer.role_department_id],
        (err, res) => {
          if (err) throw err;
          console.table(res);
          startProgram();
        });
    });
}
//-------------------------------------------------------------------------------------------

// ----------------Remove role --------------------------------------------
function removeRole() {
  const query = 'select role.id, role.title FROM role;';
  connection.query(query, (err, res) => {
    if (err) throw err;
    const roleChoices = res.map((data) => ({
      value: data.id, name: data.title,
    }));
    // console.table(res);
    // console.log(roleChoices);
    promptRole(roleChoices);
  });
}

function promptRole(roleChoices) {
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'list',
        message: 'Which role would you like to remove?',
        choices: roleChoices,
      },
    ])
    .then((answer) => {
      const query9 = 'delete from role where role.id=?;';
      connection.query(query9, [answer.id], (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
      });
    });
}
// -------------------------------------------------------------------------
