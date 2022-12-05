const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql2.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
)

db.connect(err => {
  if (err) throw err;
  init();
})

const init = () => {
  inquirer.prompt({
    type: 'list',
    name: 'start',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
      'Exit'
    ]
  })
    .then((answer) => {
      switch (answer.start) {
        case 'View All Employees':
          viewEmployees();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'View All Roles':
          viewRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          viewDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Exit':
          db.end();
          break;
      }
    });
}

viewEmployees = () => {
  const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, concat(managers.first_name, \' \', managers.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS managers ON managers.id = employee.manager_id;';
  db.query(query, (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
  });
}

addEmployee = () => {
  db.query('SELECT id, title FROM role', (err, results) => {
    if (err) throw err;
    const roles = results;
    const roleNames = roles.map(role => role.title);

    db.query('SELECT id, first_name, last_name FROM employee', (err, results) => {
      if (err) throw err;
      const employees = results;
      const employeeNames = employees.map(employee => employee.first_name + ' ' + employee.last_name);
      employeeNames.push('None');

      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'What is the employee\'s first name?',
          validate: (value) => {
            if (value) {
              return true;
            } else {
              console.log('Please enter the employee\'s first name.');
            }
          }
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'What is the employee\'s last name?',
          validate: (value) => {
            if (value) {
              return true;
            } else {
              console.log('Please enter the employee\'s last name.');
            }
          }
        },
        {
          type: 'list',
          name: 'role',
          message: 'What is the employee\'s role?',
          choices: roleNames,
          validate (value) {
            if (value) {
              return true;
            } else {
              console.log('Please enter the employee\'s role.');
            }
          }
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Who is the employee\'s manager?',
          choices: employeeNames,
          validate (value) {
            if (value) {
              return true;
            } else {
              console.log('Please enter the employee\'s manager.');
            }
          }
        }
      ]).then(answer => {
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        const roleId = roles.filter(role => role.title === answer.role).map(role => role.id);

        let managerId;
        if (answer.manager === 'None') {
          managerId = null;
        } else {
          managerId = employees.filter(employee => employee.first_name + ' ' + employee.last_name === answer.manager).map(employee => employee.id);
        }

        db.query(query, [answer.firstName, answer.lastName, roleId, managerId], (err, results) => {
          if (err) throw err;
          console.log('Employee added.');
          init();
        });
      });
    });
  });
}

updateEmployeeRole = () => {
  db.query('SELECT id, first_name, last_name FROM employee', (err, results) => {
    if (err) throw err;
    const employees = results;
    const employeeNames = employees.map(employee => employee.first_name + ' ' + employee.last_name);

    db.query('SELECT id, title FROM role', (err, results) => {
      if (err) throw err;
      const roles = results;
      const roleNames = roles.map(role => role.title);

      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Which employee\'s role would you like to update?',
          choices: employeeNames,
          validate (value) {
            if (value) {
              return true;
            } else {
              console.log('Please select an employee.');
            }
          }
        },
        {
          type: 'list',
          name: 'role',
          message: 'What is the employee\'s new role?',
          choices: roleNames,
          validate (value) {
            if (value) {
              return true;
            } else {
              console.log('Please select a new role.');
            }
          }
        }
      ]).then(answer => {
        const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
        const roleId = roles.filter(role => role.title === answer.role).map(role => role.id);
        const employeeId = employees.filter(employee => employee.first_name + ' ' + employee.last_name === answer.employee).map(employee => employee.id);

        db.query(query, [roleId, employeeId], (err, results) => {
          if (err) throw err;
          console.log('Employee role updated.');
          init();
        });
      });
    });
  });
}

viewRoles = () => {
  db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id' , (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
  });
}

addRole = () => {
  db.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    const departments = results;
    const departmentNames = departments.map(department => department.name);

    inquirer.prompt([
      {
        type: 'input',
        name: 'role',
        message: 'What is the name of the role?',
        validate: (value) => {
          if (value) {
            return true;
          } else {
            console.log('Please enter the name of the role.');
          }
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
        validate: (value) => {
          if (value) {
            return true;
          } else {
            console.log('Please enter the salary for the role.');
          }
        }
      },
      {
        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to?',
        choices: departmentNames,
        validate (value) {
          if (value) {
            return true;
          } else {
            console.log('Please select a department.');
          }
        }
      }
    ]).then(answer => {
      const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
      const departmentId = departments.filter(department => department.name === answer.department).map(department => department.id);

      db.query(query, [answer.role, parseInt(answer.salary), departmentId], (err, results) => {
        if (err) throw err;
        console.log('Role added.');
        init();
      });
    });
  });
}

viewDepartments = () => {
  db.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
}

addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the department?',
      validate: (value) => {
        if (value) {
          return true;
        } else {
          console.log('Please enter the name of the department.');
        }
      }
    }
  ]).then(answer => {
    const query = 'INSERT INTO department (name) VALUES (?)';

    db.query(query, answer.department, (err, results) => {
      if (err) throw err;
      console.log('Department added.');
      init();
    });
  });
}