const db = require('../config/database');

const clientesController = {
  getAll: (req, res) => {
    db.query('SELECT * FROM clientes', (err, result) => {
      if (err) {
        console.error('Error en getAll clientes:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  },

  create: (req, res) => {
    const { nombre, email, telefono, direccion } = req.body;
    db.query('INSERT INTO clientes (nombre,email,telefono,direccion) VALUES (?,?,?,?)',
      [nombre, email, telefono, direccion],
      (err, result) => {
        if (err) {
          console.error('Error en create cliente:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, nombre, email, telefono, direccion });
      });
  },

  update: (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, direccion } = req.body;
    db.query('UPDATE clientes SET nombre=?, email=?, telefono=?, direccion=? WHERE id=?',
      [nombre, email, telefono, direccion, id],
      (err) => {
        if (err) {
          console.error('Error en update cliente:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Cliente actualizado' });
      });
  },

  delete: (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM clientes WHERE id=?', [id], (err) => {
      if (err) {
        console.error('Error en delete cliente:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ mensaje: 'Cliente eliminado' });
    });
  }
};

module.exports = clientesController;