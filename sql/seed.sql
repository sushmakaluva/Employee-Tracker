INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES
("John", "Doe", 2, 3), 
("Mike", "Chan", 4, 4), 
("Ashley", "Rodriguez", 1, null), 
("Kevin", "Tupik", 3,null), 
("Malia", "Brown", 6,6), 
("Sarah", "Lourd", 5, null),
("Tom", "Allen", 4, 8), 
("Christian", "Eckenrode", 1, 2);


INSERT INTO role(title,salary,department_id)
VALUES
('Sales Lead',1000,1),
('Salesperson',500,1),
('Lead Engineer',5000,2),
('Software Engineer',4000,2),
('Finance Lead',10000,3),
('Accountant',2000,3),
('Lawyer',3000,4);


INSERT INTO department(name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

