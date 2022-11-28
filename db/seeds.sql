INSERT INTO department (name, id)
VALUES
  ('Sales', 1),
  ('Engineering', 2),
  ('Finance', 3),
  ('Legal', 4);

INSERT INTO role (id, title, salary, department_id)
VALUES
  (1, 'Sales Lead', 100000, 1),
  (2, 'Salesperson', 80000, 1),
  (3, 'Lead Engineer', 150000, 2),
  (4, 'Software Engineer', 120000, 2),
  (5, 'Account Manager' 160000, 3)
  (6, 'Accountant', 125000, 3),
  (7, 'Legal Team Lead', 250000, 4),
  (8, 'Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ("John", "Doe", 1, NULL),
  ("Mike", "Chan", 2, 1),
  ("Ashley", "Rodriguez", 3, NULL),
  ("Kevin", "Tupik", 4, 3),
  ("Kunal", "Singh", 5, NULL),
  ("Malia", "Brown", 6, 5),
  ("Sarah", "Lourd", 7, NULL),
  ("Tom", "Allen", 8, 7);