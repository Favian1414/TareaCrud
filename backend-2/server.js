const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión a MySQL
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // tu contraseña
    database: 'tienda'
});

// --- RUTAS DE CLIENTES ---
// Obtener todos los clientes
app.get('/clientes', (req, res) => {
    db.query('SELECT * FROM clientes', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Crear cliente
app.post('/clientes', (req, res) => {
    const { nombre, email, telefono, direccion } = req.body;
    db.query('INSERT INTO clientes (nombre,email,telefono,direccion) VALUES (?,?,?,?)',
        [nombre, email, telefono, direccion],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ id: result.insertId, nombre, email, telefono, direccion });
        });
});

// Actualizar cliente
app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, direccion } = req.body;
    db.query('UPDATE clientes SET nombre=?, email=?, telefono=?, direccion=? WHERE id=?',
        [nombre, email, telefono, direccion, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ mensaje: 'Cliente actualizado' });
        });
});

// Eliminar cliente
app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM clientes WHERE id=?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ mensaje: 'Cliente eliminado' });
    });
});

// --- RUTAS DE PEDIDOS ---
// Obtener todos los pedidos
app.get('/pedidos', (req, res) => {
    db.query('SELECT pedidos.*, clientes.nombre AS cliente_nombre FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id', 
    (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Crear pedido
app.post('/pedidos', (req, res) => {
    const { cliente_id, producto_id, cantidad } = req.body;
    db.query('INSERT INTO pedidos (cliente_id, producto_id, cantidad) VALUES (?,?,?)',
        [cliente_id, producto_id, cantidad],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ id: result.insertId, cliente_id, producto_id, cantidad });
        });
});

// Actualizar pedido
app.put('/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const { cliente_id, producto_id, cantidad } = req.body;
    db.query('UPDATE pedidos SET cliente_id=?, producto_id=?, cantidad=? WHERE id=?',
        [cliente_id, producto_id, cantidad, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ mensaje: 'Pedido actualizado' });
        });
});

// Eliminar pedido
app.delete('/pedidos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM pedidos WHERE id=?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ mensaje: 'Pedido eliminado' });
    });
});

// --- RUTAS DE PRODUCTOS ---
// Obtener todos los productos
app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Crear producto
app.post('/productos', (req, res) => {
    const { nombre, precio } = req.body;
    db.query('INSERT INTO productos (nombre, precio) VALUES (?,?)',
        [nombre, precio],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ id: result.insertId, nombre, precio });
        });
});

// Actualizar producto
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio } = req.body;
    db.query('UPDATE productos SET nombre=?, precio=? WHERE id=?',
        [nombre, precio, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ mensaje: 'Producto actualizado' });
        });
});

// Eliminar producto
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id=?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ mensaje: 'Producto eliminado' });
    });
});

app.listen(5000, () => console.log('Servidor corriendo en puerto 5000'));
