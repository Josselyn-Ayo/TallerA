const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.urlencoded({ extended: true }));

// UTF-8 para caracteres especiales
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    next();
});

const connection = mysql.createConnection({
    host: 'contenedorBD',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'base_empleados',
    charset: 'utf8mb4'
});

connection.connect((err) => {
    if (err) {
        console.log('Error MySQL');
        console.log(err);
    } else {
        console.log('MySQL conectado correctamente');
    }
});

// LISTAR EMPLEADOS
app.get('/', (req, res) => {

    connection.query('SELECT * FROM personal', (err, results) => {

        if (err) {
            console.log(err);
            return res.send("Error DB");
        }

        let tabla = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>CRUD Empleados</title>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>

        <body class="bg-dark">

        <div class="container mt-5">

            <div class="card shadow">

                <div class="card-header bg-primary text-white">
                    <h2 class="mb-0">CRUD EMPLEADOS</h2>
                </div>

                <div class="card-body">

                    <a href="/agregar" class="btn btn-success mb-3">
                        Agregar Empleado
                    </a>

                    <table class="table table-bordered table-striped text-center">

                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Cargo</th>
                                <th>Sueldo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
        `;

        results.forEach(emp => {

            tabla += `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.nombre}</td>
                <td>${emp.cargo}</td>
                <td>${emp.sueldo}</td>

                <td>
                    <a href="/editar/${emp.id}" class="btn btn-warning btn-sm">
                        Editar
                    </a>

                    <a href="/eliminar/${emp.id}"
                       class="btn btn-danger btn-sm"
                       onclick="return confirm('¿Desea eliminar este empleado?')">
                        Eliminar
                    </a>
                </td>
            </tr>
            `;
        });

        tabla += `
                        </tbody>
                    </table>

                </div>

            </div>

        </div>

        </body>
        </html>
        `;

        res.send(tabla);

    });

});

// FORMULARIO AGREGAR
app.get('/agregar', (req, res) => {

    res.send(`
    <!DOCTYPE html>
    <html lang="es">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>Agregar Empleado</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>

    <body class="bg-dark">

    <div class="container mt-5">

        <div class="card shadow">

            <div class="card-header bg-success text-white">
                <h3 class="mb-0">Agregar Empleado</h3>
            </div>

            <div class="card-body">

                <form method="POST" action="/guardar">

                    <div class="mb-3">
                        <label class="form-label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            class="form-control"
                            required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Cargo</label>
                        <input
                            type="text"
                            name="cargo"
                            class="form-control"
                            required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Sueldo</label>
                        <input
                            type="number"
                            name="sueldo"
                            class="form-control"
                            required>
                    </div>

                    <button class="btn btn-success">
                        Guardar
                    </button>

                    <a href="/" class="btn btn-secondary">
                        Volver
                    </a>

                </form>

            </div>

        </div>

    </div>

    </body>
    </html>
    `);

});

// GUARDAR
app.post('/guardar', (req, res) => {

    console.log("DATOS RECIBIDOS:", req.body);

    connection.query(
        'INSERT INTO personal(nombre, cargo, sueldo) VALUES(?,?,?)',
        [
            req.body.nombre,
            req.body.cargo,
            req.body.sueldo
        ],
        (err) => {

            if (err) {
                console.log("ERROR INSERT:", err);
                return res.send("Error al guardar");
            }

            console.log("INSERT OK");
            res.redirect('/');
        }
    );

});

// ELIMINAR
app.get('/eliminar/:id', (req, res) => {

    connection.query(
        'DELETE FROM personal WHERE id=?',
        [req.params.id],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Error al eliminar");
            }

            res.redirect('/');
        }
    );

});

// FORMULARIO EDITAR
app.get('/editar/:id', (req, res) => {

    connection.query(
        'SELECT * FROM personal WHERE id=?',
        [req.params.id],
        (err, results) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            const emp = results[0];

            res.send(`
            <!DOCTYPE html>
            <html lang="es">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <title>Editar Empleado</title>

                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>

            <body class="bg-dark">

            <div class="container mt-5">

                <div class="card shadow">

                    <div class="card-header bg-warning">
                        <h3 class="mb-0">Editar Empleado</h3>
                    </div>

                    <div class="card-body">

                        <form method="POST" action="/actualizar">

                            <input
                                type="hidden"
                                name="id"
                                value="${emp.id}">

                            <div class="mb-3">
                                <label class="form-label">Nombre</label>
                                <input
                                    class="form-control"
                                    name="nombre"
                                    value="${emp.nombre}"
                                    required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Cargo</label>
                                <input
                                    class="form-control"
                                    name="cargo"
                                    value="${emp.cargo}"
                                    required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Sueldo</label>
                                <input
                                    class="form-control"
                                    name="sueldo"
                                    value="${emp.sueldo}"
                                    required>
                            </div>

                            <button class="btn btn-warning">
                                Actualizar
                            </button>

                            <a href="/" class="btn btn-secondary">
                                Volver
                            </a>

                        </form>

                    </div>

                </div>

            </div>

            </body>
            </html>
            `);

        }
    );

});

// ACTUALIZAR
app.post('/actualizar', (req, res) => {

    connection.query(
        'UPDATE personal SET nombre=?, cargo=?, sueldo=? WHERE id=?',
        [
            req.body.nombre,
            req.body.cargo,
            req.body.sueldo,
            req.body.id
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Error al actualizar");
            }

            res.redirect('/');
        }
    );

});

app.listen(3000, '0.0.0.0', () => {
    console.log('CRUD FUNCIONANDO http://localhost:3000');
});