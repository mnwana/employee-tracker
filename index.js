const inquirer = require("inquirer");
const { query } = require("./db/connection");
const db = require("./db/connection");

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
        message:
          "Please enter the first name of the employee you would like to add:",
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
          if (userChoice == "add an employee") {
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
          if (userChoice == "add an employee") {
            return true;
          } else {
            return false;
          }
        },
      },
    ])
    .then((queryData) => {
      console.log(queryData);
      handleUserInput(queryData);
      if (queryData.userChoice == "complete queries") {
        console.log("Goodbye!");
      } else {
        promptUser();
      }
    });
};

const handleUserInput = function (queryData) {
  var sql = "";
  var params = [];
  if (queryData.userChoice == "view all departments") {
    sql = "Select * from department;";
  }
  else if (queryData.userChoice == "view all roles") {
    sql = "Select * from role;";
  }
  else if (queryData.userChoice == "view all employees") {
    sql = sql = "Select * from employee;";
  }
  else if (queryData.userChoice ==  "add a department") {
    var inputs = addDepartmentQuery(queryData);
    sql = inputs[0];
    params = inputs[1];
  }
  else if (queryData.userChoice ==  "add a role") {
    var inputs = addRoleQuery(queryData);
    sql = inputs[0];
    params = inputs[1];
  }
  else if (queryData.userChoice ==  "add an employee") {
    var inputs = addEmployeeQuery(queryData);
    sql = inputs[0];
    params = inputs[1];
  }
  else if (queryData.userChoice ==  "update an employee role") {
    var inputs = updateEmployeeQuery(queryData);
    sql = inputs[0];
    params = inputs[1];
  }
  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
    console.log('Move arrow up or down to reveal menu and choose another action.');
  });
};

const roles = function () {
  var sql = "Select title from role"
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
  });
}

const employees = function () {
  var sql = "Select first_name from employee"
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
  });
}

const departments = function () {
  var sql = "Select name from department"
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
  });
}

const addDepartmentQuery = function (queryData) {
  return [`INSERT INTO department (name)
   VALUES (?) ;`, [queryData.departmentAddName]];
};

const addRoleQuery = function (queryData) {
  console.log([queryData.roleAddSalary,queryData.roleAddName, query.roleAddDepartment]);
  return [`INSERT INTO role (salary,title,department_id)
   VALUES (?,?,?) ;`,
   [queryData.roleAddSalary,queryData.roleAddName, parseInt(query.roleAddDepartment)]];
};

const addEmployeeQuery = function (queryData) {
  return [`INSERT INTO employee (first_name,last_name,role_id,manager_id)
   VALUES (?,?,?,?,?) ;`, [queryData.employeeAddFName,queryData.employeeAddLName,queryData.employeeAddRole,queryData.employeeAddManager]];
};

const updateEmployeeQuery = function (queryData) {
  return [`UPDATE employee 
  SET role = ?
  WHERE ID = ? ;`, [queryData.updateEmployeeRole,queryData.updateEmployeeID]];
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