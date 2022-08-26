const inquirer = require("inquirer");
const { query } = require("./db/connection");
const db = require("./db/connection");
const cTable = require("console.table");

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

const roles = function () {
  var sql =
    "Select distinct concat(department.name, ' - ' , role.title) as title from role left join department on role.department_id = department.id;";
  return new Promise((resolve, reject) =>
    db.query(sql, [], (err, result) => {
      if (err) {
        console.log(err);
        return reject;
      }
      // console.log(result.map(a => a.title));
      resolve(result.map((a) => a.title));
    })
  );
};

const roleId = function (roleName) {
  var sql =
    "Select role.id from role left join department on role.department_id = department.id where concat(department.name, ' - ' , role.title) = ?;";
  return new Promise((resolve, reject) =>
    db.query(sql, [roleName], (err, result) => {
      if (err) {
        console.log(err);
        return reject;
      }
      // console.log(result.map(a => a.id)[0]);
      resolve(result.map((a) => a.id)[0]);
    })
  );
};

const employees = function () {
  var sql = "Select concat(first_name,' ', last_name) as name from employee;";
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

const employeeId = function (employeeName) {
  var sql =
    "Select employee.id from employee where concat(first_name,' ', last_name) = ?;";
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

const promptUser = function () {
  return inquirer
    .prompt([
      {
        name: "userChoice",
        message: "What would you like to do?",
        type: "list",
        choices: userChoices,
      },
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
      {
        name: "employeeAddManager",
        message:
          "Please enter the manager of the employee you would like to add:",

        type: "list",
        choices: employees,
        when: ({ userChoice }) => {
          if (userChoice == "add an employee") {
            return true;
          } else {
            return false;
          }
        },
      },
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
      // console.log(queryData);
      handleUserInput(queryData);
      if (queryData.userChoice == "complete queries") {
        console.log("Goodbye!");
        process.exit();
      } else {
        promptUser();
      }
    });
};

const handleUserInput = function (queryData) {
  if (queryData.userChoice == "view all departments") {
    db.query("Select * from department;", [], (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`\n`);
      console.table(result);
    });
  } else if (queryData.userChoice == "view all roles") {
    db.query("Select role.*, department.name from role left join department on role.department_id = department.id;", [], (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`\n`);
      console.table(result);
    });
  } else if (queryData.userChoice == "view all employees") {
    db.query(`Select employee.first_name,employee.last_name, role.title as role, role.salary, department.name as department, concat(manager.first_name, ' ',manager.last_name) as manager   
    from employee left join role on employee.role_id = role.id 
    left join department on department.id = role.department_id
    left join employee as manager on manager.id = employee.manager_id
    ;`, [], (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`\n`);
      console.table(result);
    });
  } else if (queryData.userChoice == "add a department") {
    addDepartmentQuery(queryData);
  } else if (queryData.userChoice == "add a role") {
    addRoleQuery(queryData);
  } else if (queryData.userChoice == "add an employee") {
    addEmployeeQuery(queryData);
  } else if (queryData.userChoice == "update an employee role") {
    updateEmployeeQuery(queryData);
  }
};

const addDepartmentQuery = function (queryData) {
  var sql = `INSERT INTO department (name) VALUES (?) ;`;
  db.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`\n`);
    console.table(result);
  });
};

const addRoleQuery = function (queryData) {
  var sql = `INSERT INTO role (salary,title,department_id)
   VALUES (?,?,?) ;`;
  var params = [queryData.roleAddSalary, queryData.roleAddName];
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

const addEmployeeQuery = function (queryData) {
  var sql = `INSERT INTO employee (first_name,last_name,role_id,manager_id)
    VALUES (?,?,?,?) ;`;
  var params = [queryData.employeeAddFName, queryData.employeeAddLName];
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

const updateEmployeeQuery = function (queryData) {
  var sql = `UPDATE employee SET role_id = ? WHERE ID = ? ;`;
  var params = [];
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

const init = function () {
  if (process.argv[2] == "mock") {
  } else {
    promptUser().then(() => {
      console.log("");
    });
  }
};

init();
