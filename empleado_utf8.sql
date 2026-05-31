USE base_empleados;

CREATE TABLE IF NOT EXISTS personal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  cargo VARCHAR(30),
  sueldo DECIMAL(10,2)
);

INSERT INTO personal (nombre, cargo, sueldo) VALUES
('Juan PÃ©rez', 'Gerente', 2500.00),
('MarÃ­a GarcÃ­a', 'Analista', 1800.50),
('Luis LÃ³pez', 'Desarrollador', 2000.75),
('Ana Torres', 'DiseÃ±adora', 1750.00),
('Pedro Ruiz', 'Tester', 1600.00),
('Carmen Vega', 'Contadora', 1950.00),
('Carlos Molina', 'Administrador', 2100.00),
('Laura Salazar', 'Secretaria', 1500.00),
('AndrÃ©s Viteri', 'Soporte TÃ©cnico', 1600.00),
('Fernanda ChÃ¡vez', 'Marketing', 1850.00),
('Esteban Paredes', 'Ventas', 1700.00),
('Gina Ruiz', 'Ventas', 1700.00),
('Roberto Jara', 'Seguridad', 1400.00),
('Martha Rivas', 'Asistente', 1550.00),
('Diego Castro', 'Auditor', 2000.00),
('Daniela CedeÃ±o', 'Recursos Humanos', 1900.00),
('Kevin Mora', 'Desarrollador', 2050.00),
('LucÃ­a MÃ©ndez', 'DiseÃ±adora', 1780.00),
('Pablo Ortiz', 'Tester', 1650.00),
('RocÃ­o Arias', 'Soporte TÃ©cnico', 1625.00),
('HernÃ¡n Silva', 'Administrador', 2150.00),
('Silvia Bravo', 'Analista', 1850.00),
('SofÃ­a JimÃ©nez', 'Ventas', 1680.00),
('Ramiro LeÃ³n', 'Gerente', 2550.00),
('Dayana GÃ³mez', 'Contadora', 1920.00),
('Jorge Tapia', 'Auditor', 1980.00),
('Beatriz Cobo', 'Secretaria', 1520.00),
('FabiÃ¡n Torres', 'Soporte TÃ©cnico', 1610.00),
('Melanie Rosero', 'Recursos Humanos', 1930.00),
('IvÃ¡n MÃ©ndez', 'Marketing', 1875.00);
