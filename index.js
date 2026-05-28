const express = require('express');
const mysql = require('mysql2');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'password',
    database: 'base_empleados'
});

connection.connect((err) => {
    if (err) {
        console.log('Error MySQL');
        console.log(err);
    } else {
        console.log('MySQL conectado correctamente');
    }
});

app.get('/', (req, res) => {

    connection.query('SELECT * FROM personal', (err, results) => {

        if (err) {
            console.log(err);
            return res.send("Error DB");
        }

        let tabla = `
        <html>
        <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body class="bg-dark">
        <div class="container mt-5">
        <div class="card">
        <div class="card-header bg-primary text-white">
        CRUD EMPLEADOS
        </div>
        <div class="card-body">

        <a href="/agregar" class="btn btn-success mb-3">Agregar</a>

        <table class="table table-bordered text-center">
        <thead class="table-dark">
        <tr>
        <th>ID</th><th>Nombre</th><th>Cargo</th><th>Salario</th><th>Acciones</th>
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
            <td>${emp.salario}</td>
            <td>
            <a class="btn btn-warning btn-sm" href="/editar/${emp.id}">Editar</a>
            <a class="btn btn-danger btn-sm" href="/eliminar/${emp.id}">Eliminar</a>
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

app.get('/agregar', (req, res) => {

    res.send(`
    <form method="POST" action="/guardar">
    <input name="nombre" placeholder="Nombre">
    <input name="cargo" placeholder="Cargo">
    <input name="salario" placeholder="Salario">
    <button>Guardar</button>
    </form>
    `);

});

app.post('/guardar', (req, res) => {

    console.log("DATOS RECIBIDOS:", req.body);

    connection.query(
        'INSERT INTO personal(nombre, cargo, salario) VALUES(?,?,?)',
        [req.body.nombre, req.body.cargo, req.body.salario],
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

app.get('/eliminar/:id', (req, res) => {

    connection.query(
        'DELETE FROM personal WHERE id=?',
        [req.params.id],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            res.redirect('/');
        }
    );
});

app.get('/editar/:id', (req, res) => {

    connection.query(
        'SELECT * FROM personal WHERE id=?',
        [req.params.id],
        (err, results) => {

            if (err) return res.send("Error");

            const emp = results[0];

            res.send(`
            <form method="POST" action="/actualizar">
            <input type="hidden" name="id" value="${emp.id}">
            <input name="nombre" value="${emp.nombre}">
            <input name="cargo" value="${emp.cargo}">
            <input name="salario" value="${emp.salario}">
            <button>Actualizar</button>
            </form>
            `);
        }
    );
});

app.post('/actualizar', (req, res) => {

    connection.query(
        'UPDATE personal SET nombre=?, cargo=?, salario=? WHERE id=?',
        [req.body.nombre, req.body.cargo, req.body.salario, req.body.id],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            res.redirect('/');
        }
    );
});

app.listen(3000, () => {
    console.log('CRUD FUNCIONANDO http://localhost:3000');
});