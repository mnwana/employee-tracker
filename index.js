const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");

// array of database operations
const userChoices = [
  "view all departments",
  "view all roles",
  "view all employees",
  "add a department",
  "add a role",
  "add an employee",
  "update an employee role",
  "complete queries",
];

// query to return array of role and department names
const roles = function () {
  var sql =
    `Select distinct concat(department.name, ' - ' , role.title) as title 
    from role 
    left join department on role.department_id = department.id;`;
  return new Promise((resolve, reject) =>
    db.query(sql, [], (err, result) => {
      if (err) {
        console.log(err);
        return reject;
      }
      resolve(result.map((a) => a.title));
    })
  );
};

// query to return role id based on role and department name
const roleId = function (roleName) {
  var sql =
    `Select role.id 
    from role 
    left join department on role.department_id = department.id 
    where concat(department.name, ' - ' , role.title) = ?;`;
  return new Promise((resolve, reject) =>
    db.query(sql, [roleName], (err, result) => {
      if (err) {
        console.log(err);
        return reject;
      }
      resolve(result.map((a) => a.id)[0]);
    })
  );
};

// query to return array of employee first and last names
const employees = function () {
  var sql = `Select concat(first_name,' ', last_name) as name 
  from employee;`;
  return new Promise((resolve, reject) =>
    db.query(sql, [], (err, result) => {
      if (err) {
        console.log(err);
        return reject;
      }
      resolve(result.map((a) => a.name));
    })
  );
};

// query to return an employee id based on first and last name
const employeeId = function (employeeName) {
  var sql =
    `Select employee.id 
    from employee 
    where concat(first_name,' ', last_name) = ?;`;
  return new Promise((resolve, reject) =>
    db.query(sql, [employeeName], (err, result) => {
      if (err) {
        console.log(err);
        return reject;
      }
      resolve(result.map((a) => a.id)[0]);
    })
  );
};

// query to return an array of department names
const departments = function () {
  var sql = "Select name from department;";
  return new Promise((resolve, reject) =>
    db.query(sql, [], (err, result) => {
      if (err) {
        console.log(err);
        return reject;
      }
      resolve(result.map((a) => a.name));
    })
  );
};

// query to return a department id based on department name
const departmentId = function (departmentName) {
  var sql = "Select department.id from department where name = ?;";
  return new Promise((resolve, reject) =>
    db.query(sql, [departmentName], (err, result) => {
      if (err) {
        console.log(err);
        return reject;
      }
      resolve(result.map((a) => a.id)[0]);
    })
  );
};

// prompt user for their database actions
const promptUser = function () {
  return inquirer
    .prompt([
      // prompt user for what they'd like to do
      {
        name: "userChoice",
        message: "What would you like to do?",
        type: "list",
        choices: userChoices,
      },
      // if add department, get department name
      {
        name: "departmentAddName",
        message:
          "Please enter the name of the department you would like to add:",
        type: "input",
        when: ({ userChoice }) => {
          if (userChoice == "add a department") {
            return true;
          } else {
            return false;
          }
        },
      },
      // if add role, get role name, salary, and department
      {
        name: "roleAddName",
        message: "Please enter the name of the role you would like to add:",
        type: "input",
        when: ({ userChoice }) => {
          if (userChoice == "add a role") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: "roleAddSalary",
        message: "Please enter the salary of the role you would like to add:",
        type: "input",
        when: ({ userChoice }) => {
          if (userChoice == "add a role") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: "roleAddDepartment",
        message:
          "Please enter the department of the role you would like to add:",
        type: "list",
        choices: departments,
        when: ({ userChoice }) => {
          if (userChoice == "add a role") {
            return true;
          } else {
            return false;
          }
        },
      },
      // if add employee, get first name, last name, role and manager
      {
        name: "employeeAddFName",
        message:
          "Please enter the first name of the employee you would like to add:",
        type: "input",
        when: ({ userChoice }) => {
          if (userChoice == "add an employee") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: "employeeAddLName",
        message:
          "Please enter the last name of the employee you would like to add:",
        type: "input",
        when: ({ userChoice }) => {
          if (userChoice == "add an employee") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: "employeeAddRole",
        message: "Please enter the role of the employee you would like to add:",
        type: "list",
        choices: roles,
        when: ({ userChoice }) => {
          if (userChoice == "add an employee") {
            return true;
          } else {
            return false;
          }
        },
      },
      // TODO: ensure that no manager (null) is an option
      {
        name: "employeeAddManager",
        message:
          "Please enter the manager of the employee you would like to add:",

        type: "list",
        choices: employees.push('No Manager'),
        when: ({ userChoice }) => {
          if (userChoice == "add an employee") {
            return true;
          } else {
            return false;
          }
        },
      },
      // if update employee, get name of employee and role they will be set to
      {
        name: "updateEmployeeName",
        message:
          "Please select the name of the employee you would like to update:",
        choices: employees,
        type: "list",
        when: ({ userChoice }) => {
          if (userChoice == "update an employee role") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: "updateEmployeeRole",
        message:
          "Please select the new role of the employee you would like to update:",
        choices: roles,
        type: "list",
        when: ({ userChoice }) => {
          if (userChoice == "update an employee role") {
            return true;
          } else {
            return false;
          }
        },
      },
    ])
    .then((queryData) => {
      // call function to perform database actions
      handleUserInput(queryData);
      // if option is to exit, end quit app
      if (queryData.userChoice == "complete queries") {
        console.log("Goodbye!");
        process.exit();
      } 
      // if not complete queries, ask user for the next action
      else {
        promptUser();
      }
    });
};

// handle user input from inquirer prompt
const handleUserInput = function (queryData) {
  // select all department names and ids
  if (queryData.userChoice == "view all departments") {
    db.query("Select * from department;", [], (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`\n`);
      console.table(result);
    });
    // select role title, id, salary, and department name
  } else if (queryData.userChoice == "view all roles") {
    db.query(
      "Select role.*, department.name from role left join department on role.department_id = department.id;",
      [],
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`\n`);
        console.table(result);
      }
    );
    // select employee name, titole, role, salary, department and manager
  } else if (queryData.userChoice == "view all employees") {
    db.query(
      `Select employee.first_name,employee.last_name, role.title as role, role.salary, department.name as department, concat(manager.first_name, ' ',manager.last_name) as manager   
    from employee left join role on employee.role_id = role.id 
    left join department on department.id = role.department_id
    left join employee as manager on manager.id = employee.manager_id
    ;`,
      [],
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`\n`);
        console.table(result);
      }
    );
  } 
  // add department name to departments
  else if (queryData.userChoice == "add a department") {
    addDepartmentQuery(queryData);
  } 
  // add role name and department id to roles
  else if (queryData.userChoice == "add a role") {
    addRoleQuery(queryData);
  } 
  // add employee first name, last name, role and manager
  else if (queryData.userChoice == "add an employee") {
    addEmployeeQuery(queryData);
  } 
  // update employee role id
  else if (queryData.userChoice == "update an employee role") {
    updateEmployeeQuery(queryData);
  }
};

// run query to add department
const addDepartmentQuery = function (queryData) {
  var sql = `INSERT INTO department (name) VALUES (?) ;`;
  db.query(sql, [queryData.departmentAddName], (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`\n`);
    console.table(result);
  });
};

// run query to add role
const addRoleQuery = function (queryData) {
  var sql = `INSERT INTO role (salary,title,department_id)
   VALUES (?,?,?) ;`;
  var params = [queryData.roleAddSalary, queryData.roleAddName];
  // get department id for new role then run query
  departmentId(queryData.roleAddDepartment).then((result) => {
    params.push(result);
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`\n`);
      console.table(result);
    });
  });
};

// run query to add employee
const addEmployeeQuery = function (queryData) {
  var sql = `INSERT INTO employee (first_name,last_name,role_id,manager_id)
    VALUES (?,?,?,?) ;`;
  var params = [queryData.employeeAddFName, queryData.employeeAddLName];
  // get role id then employee id of manager for new employee then run query
  roleId(queryData.employeeAddRole).then((result) => {
    params.push(result);
    employeeId(queryData.employeeAddManager).then((result) => {
      params.push(result);
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`\n`);
        console.table(result);
      });
    });
  });
};

// run query to update employee
const updateEmployeeQuery = function (queryData) {
  var sql = `UPDATE employee SET role_id = ? WHERE ID = ? ;`;
  var params = [];
  // get role id then employee id for updated employee
  roleId(queryData.updateEmployeeRole).then((result) => {
    params.push(result);
    employeeId(queryData.updateEmployeeName).then((result) => {
      params.push(result);
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`\n`);
        console.table(result);
      });
    });
  });
};

// initiate app
const init = function () {
    promptUser().then(() => {});
};

init();
