DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY(manager_id) REFERENCES employee(id)
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) default 0,
    department_id INT,
    FOREIGN KEY(department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name_dept VARCHAR(30) NOT NULL
);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("Adam", "Bower",1 ,NULL);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("Ashley", "Buckland",5 ,NULL);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("John", "Leonard",1 ,1);

INSERT INTO department(name_dept) VALUES ("Sales");
INSERT INTO department(name_dept) VALUES ("Engineering");
INSERT INTO department(name_dept) VALUES ("Finance");
INSERT INTO department(name_dept) VALUES ("Legal");

INSERT INTO roles(title, department_id) VALUES ("Sales Lead", 1);
INSERT INTO roles(title, department_id) VALUES ("Salesperson", 1);
INSERT INTO roles(title, department_id) VALUES ("Lead Engineer", 2);
INSERT INTO roles(title, department_id) VALUES ("Software Engineer", 2);
INSERT INTO roles(title, department_id) VALUES ("Account Manager", 3);
INSERT INTO roles(title, department_id) VALUES ("Accountant", 3);
INSERT INTO roles(title, department_id) VALUES ("Legal Team Lead", 4);
INSERT INTO roles(title, department_id) VALUES ("Lawyer", 4);


SELECT * FROM employee;

    
        
        
        
        
        
        
        