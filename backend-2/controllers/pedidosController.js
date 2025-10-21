const db = require('../config/database');

const pedidosController = {
  getAll: (req, res) => {
    db.query('SELECT pedidos.*, clientes.nombre AS cliente_nombre FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id', 
      (err, result) => {
        if (err) {
          console.error('Error en getAll pedidos:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json(result);
      });
  },

  create: (req, res) => {
    const { cliente_id, producto_id, cantidad } = req.body;
    db.query('INSERT INTO pedidos (cliente_id, producto_id, cantidad) VALUES (?,?,?)',
      [cliente_id, producto_id, cantidad],
      (err, result) => {
        if (err) {
          console.error('Error en create pedido:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, cliente_id, producto_id, cantidad });
      });
  },

  update: (req, res) => {
    const { id } = req.params;
    const { cliente_id, producto_id, cantidad } = req.body;
    db.query('UPDATE pedidos SET cliente_id=?, producto_id=?, cantidad=? WHERE id=?',
      [cliente_id, producto_id, cantidad, id],
      (err) => {
        if (err) {
          console.error('Error en update pedido:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Pedido actualizado' });
      });
  },

  delete: (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM pedidos WHERE id=?', [id], (err) => {
      if (err) {
        console.error('Error en delete pedido:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ mensaje: 'Pedido eliminado' });
    });
  }
};

module.exports = pedidosController;