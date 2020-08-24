SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist
FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year = top5000.year)
WHERE top_albums.artist = 'eminem' AND top5000.artist = 'eminem' ORDER BY top_albums.year, top_albums.position;\

-- id first last title dept salary manager --
-- to bring all the employees --
SELECT employee.id, first_name, last_name, roles.title, department.name_dept, roles.salary, employee.manager_id
FROM roles 
RIGHT JOIN employee ON employee.role_id = roles.id
LEFT JOIN department ON roles.department_id = department.id;

-- to bring which manager you want to see --
SELECT employee.id,  
CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee
LEFT JOIN roles  ON employee.role_id = roles.id
LEFT JOIN department ON roles.department_id = department.id
LEFT JOIN employee manager ON manager.id = employee.manager_id
WHERE employee.manager_id = '1';

-- to show all the managers listed --
SELECT employee.id,  
CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee
LEFT JOIN roles  ON employee.role_id = roles.id
LEFT JOIN department ON roles.department_id = department.id
LEFT JOIN employee manager ON manager.id = employee.manager_id
WHERE employee.manager_id IS NOT NULL
GROUP BY manager

-- to show all the manager with their id --
SELECT employee.manager_id,
CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee
LEFT JOIN employee manager ON employee.manager_id = manager.id
WHERE employee.manager_id > 0
GROUP BY manager;