DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) default 0,
    department_id INT
);

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name_dept VARCHAR(30) NOT NULL
);

INSERT INTO department(name_dept) VALUES ("Sales");
INSERT INTO department(name_dept) VALUES ("Engineering");
INSERT INTO department(name_dept) VALUES ("Finance");
INSERT INTO department(name_dept) VALUES ("Legal");

INSERT INTO roles(title) VALUES ("Sales Lead");
INSERT INTO roles(title) VALUES ("Salesperson");
INSERT INTO roles(title) VALUES ("Lead Engineer");
INSERT INTO roles(title) VALUES ("Software Engineer");
INSERT INTO roles(title) VALUES ("Account Manager");
INSERT INTO roles(title) VALUES ("Accountant");
INSERT INTO roles(title) VALUES ("Legal Team Lead");
INSERT INTO roles(title) VALUES ("Lawyer");


SELECT * FROM employee;

    
        
        
        
        
        
        
        