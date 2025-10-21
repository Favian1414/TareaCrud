const db = require('../config/database');

const productosController = {
  getAll: (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
      if (err) {
        console.error('Error en getAll productos:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  },

  create: (req, res) => {
    const { nombre, precio } = req.body;
    db.query('INSERT INTO productos (nombre, precio) VALUES (?,?)',
      [nombre, precio],
      (err, result) => {
        if (err) {
          console.error('Error en create producto:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, nombre, precio });
      });
  },

  update: (req, res) => {
    const { id } = req.params;
    const { nombre, precio } = req.body;
    db.query('UPDATE productos SET nombre=?, precio=? WHERE id=?',
      [nombre, precio, id],
      (err) => {
        if (err) {
          console.error('Error en update producto:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Producto actualizado' });
      });
  },

  delete: (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id=?', [id], (err) => {
      if (err) {
        console.error('Error en delete producto:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ mensaje: 'Producto eliminado' });
    });
  }
};

module.exports = productosController;