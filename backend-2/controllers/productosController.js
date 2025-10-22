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
    const { 
      nombre, 
      descripcion, 
      precio, 
      precio_original, 
      categoria, 
      stock, 
      stock_minimo, 
      sku, 
      imagen, 
      proveedor, 
      activo 
    } = req.body;

    // Generar SKU automáticamente si está vacío
    let skuValue = sku;
    if (!sku || sku.trim() === '') {
      skuValue = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    db.query(
      `INSERT INTO productos (
        nombre, descripcion, precio, precio_original, categoria, 
        stock, stock_minimo, sku, imagen, proveedor, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre, 
        descripcion, 
        precio, 
        precio_original || precio,
        categoria, 
        stock || 0, 
        stock_minimo || 5, 
        skuValue,  // Usar SKU generado
        imagen, 
        proveedor, 
        activo !== undefined ? activo : true
      ],
      (err, result) => {
        if (err) {
          console.error('Error en create producto:', err);
          return res.status(500).json({ error: err.message });
        }
        
        res.json({ 
          id: result.insertId, 
          nombre, 
          descripcion, 
          precio, 
          precio_original: precio_original || precio,
          categoria, 
          stock: stock || 0, 
          stock_minimo: stock_minimo || 5, 
          sku: skuValue,
          imagen, 
          proveedor, 
          activo: activo !== undefined ? activo : true
        });
      }
    );
  },

  update: (req, res) => {
    const { id } = req.params;
    const { 
      nombre, 
      descripcion, 
      precio, 
      precio_original, 
      categoria, 
      stock, 
      stock_minimo, 
      sku, 
      imagen, 
      proveedor, 
      activo 
    } = req.body;

    // Generar SKU automáticamente si está vacío
    let skuValue = sku;
    if (!sku || sku.trim() === '') {
      skuValue = `PROD-${id}-${Date.now()}`;
    }

    db.query(
      `UPDATE productos SET 
        nombre=?, descripcion=?, precio=?, precio_original=?, categoria=?,
        stock=?, stock_minimo=?, sku=?, imagen=?, proveedor=?, activo=?
      WHERE id=?`,
      [
        nombre, 
        descripcion, 
        precio, 
        precio_original, 
        categoria, 
        stock, 
        stock_minimo, 
        skuValue,  // Usar SKU generado
        imagen, 
        proveedor, 
        activo, 
        id
      ],
      (err) => {
        if (err) {
          console.error('Error en update producto:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Producto actualizado', sku: skuValue });
      }
    );
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
  },

  getByCategoria: (req, res) => {
    const { categoria } = req.params;
    db.query('SELECT * FROM productos WHERE categoria = ? AND activo = TRUE', [categoria], (err, result) => {
      if (err) {
        console.error('Error en getByCategoria:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  },

  getStockBajo: (req, res) => {
    db.query('SELECT * FROM productos WHERE stock <= stock_minimo AND activo = TRUE', (err, result) => {
      if (err) {
        console.error('Error en getStockBajo:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  },

  updateStock: (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    db.query('UPDATE productos SET stock = ? WHERE id = ?', [stock, id], (err) => {
      if (err) {
        console.error('Error en updateStock:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ mensaje: 'Stock actualizado' });
    });
  }
};

module.exports = productosController;