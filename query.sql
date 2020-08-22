SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist
FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year = top5000.year)
WHERE top_albums.artist = 'eminem' AND top5000.artist = 'eminem' ORDER BY top_albums.year, top_albums.position;\


-- to bring all the employees --
SELECT employee.id, first_name, last_name, roles.title, department.name_dept, roles.salary, employee.manager_id
FROM roles 
RIGHT JOIN employee ON employee.role_id = roles.id
LEFT JOIN department ON roles.department_id = department.id;