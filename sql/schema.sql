DROP DATABASE IF EXISTS employee_tracker_db;
create database employee_tracker_db;
use employee_tracker_db;

create table employee (
id INT NOT NULL AUTO_INCREMENT,
PRIMARY KEY (id),
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT NULL,
FOREIGN KEY (role_id) REFERENCES role(id)
);

create table role (
id INT NOT NULL AUTO_INCREMENT,
PRIMARY KEY (id),
title VARCHAR(30) NULL,
salary DECIMAL(10,0) NULL,
department_id INT NULL,
FOREIGN KEY (department_id) REFERENCES department(id)
);

create table department (
id INT NOT NULL AUTO_INCREMENT,
PRIMARY KEY (id),
name VARCHAR(30) NULL
);
