const inquirer = require("inquirer");
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
        name: "departmentAdd",
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
        //   update this to be roles in DB
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
        name: "userAddFName",
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
        name: "userAddLName",
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
        name: "userAddRole",
        message:
          "Please enter the first name of the employee you would like to add:",
        //   update this to be roles in DB
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
        name: "userAddManager",
        message:
          "Please enter the manager of the employee you would like to add:",
        //   update this to be managers in DB
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
        name: "updateEmployeeName",
        message:
          "Please select the name of the employee you would like to update:",
        //   update this to be employees in DB
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
        name: "updateEmployeeRole",
        message:
          "Please select the new role of the employee you would like to update:",
        //   update this to be employees in DB
        type: "input",
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
    var inputs = viewDepartmentsQuery(queryData);
    sql = inputs[0];
    params = inputs[1];
  }
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
    console.log('Move arrow up or down to reveal menu and choose another action.');
  });
};

const viewDepartmentsQuery = function (queryData) {
  return ["Select * from department;", []];
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