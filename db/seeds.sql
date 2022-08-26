INSERT INTO department
(name)
VALUES
('Marketing'),
('Engineering'),
('Data'),
('Sales and Revenue'),
('Human Resources'),
('Legal');

INSERT INTO role
(title,salary,department_id)
VALUES
('Senior Manager',120000,1),
('Senior Manager',13000,2),
('Senior Manager',14000,3),
('Senior Manager',17000,5),
('Assistant',22000,1),
('Assistant',33000,4),
('Assistant',44000,3),
('Assistant',34000,6);

INSERT INTO employee
(first_name,last_name,role_id,manager_id)
VALUES 
('Marie','Nolan',2,NULL),
('Nicole','Jenkins',1,NULL),
('Mike','Monee',3,NULL),
('Will','Smith',4,NULL),
('Nick','Jones',5,1),
('Tom','Ford',6,3),
('Anne','Klein',8,2),
('JC','Penny',7,4);
