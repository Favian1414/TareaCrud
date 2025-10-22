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
    const { 
      tipo, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      celular, 
      dni_ruc, 
      direccion, 
      ciudad, 
      departamento, 
      codigo_postal, 
      fecha_nacimiento, 
      genero, 
      categoria, 
      puntos, 
      activo 
    } = req.body;

    db.query(
      `INSERT INTO clientes (
        tipo, nombre, apellido, email, telefono, celular, dni_ruc, 
        direccion, ciudad, departamento, codigo_postal, fecha_nacimiento, 
        genero, categoria, puntos, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tipo || 'persona',
        nombre,
        apellido || null,
        email || null,
        telefono || null,
        celular || null,
        dni_ruc || null,
        direccion || null,
        ciudad || null,
        departamento || null,
        codigo_postal || null,
        fecha_nacimiento || null,
        genero || null,
        categoria || 'normal',
        puntos || 0,
        activo !== undefined ? activo : true
      ],
      (err, result) => {
        if (err) {
          console.error('Error en create cliente:', err);
          return res.status(500).json({ error: err.message });
        }
        
        // Devolver el cliente creado con todos los campos
        res.json({ 
          id: result.insertId,
          tipo: tipo || 'persona',
          nombre,
          apellido: apellido || null,
          email: email || null,
          telefono: telefono || null,
          celular: celular || null,
          dni_ruc: dni_ruc || null,
          direccion: direccion || null,
          ciudad: ciudad || null,
          departamento: departamento || null,
          codigo_postal: codigo_postal || null,
          fecha_nacimiento: fecha_nacimiento || null,
          genero: genero || null,
          categoria: categoria || 'normal',
          puntos: puntos || 0,
          activo: activo !== undefined ? activo : true
        });
      }
    );
  },

  update: (req, res) => {
    const { id } = req.params;
    const { 
      tipo, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      celular, 
      dni_ruc, 
      direccion, 
      ciudad, 
      departamento, 
      codigo_postal, 
      fecha_nacimiento, 
      genero, 
      categoria, 
      puntos, 
      activo 
    } = req.body;

    db.query(
      `UPDATE clientes SET 
        tipo=?, nombre=?, apellido=?, email=?, telefono=?, celular=?, dni_ruc=?,
        direccion=?, ciudad=?, departamento=?, codigo_postal=?, fecha_nacimiento=?,
        genero=?, categoria=?, puntos=?, activo=?
      WHERE id=?`,
      [
        tipo,
        nombre,
        apellido,
        email,
        telefono,
        celular,
        dni_ruc,
        direccion,
        ciudad,
        departamento,
        codigo_postal,
        fecha_nacimiento,
        genero,
        categoria,
        puntos,
        activo,
        id
      ],
      (err) => {
        if (err) {
          console.error('Error en update cliente:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Cliente actualizado' });
      }
    );
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
  },

  // NUEVO: Obtener cliente por ID
  getById: (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error en getById cliente:', err);
        return res.status(500).json({ error: err.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json(result[0]);
    });
  },

  // NUEVO: Obtener clientes por categoría
  getByCategoria: (req, res) => {
    const { categoria } = req.params;
    db.query('SELECT * FROM clientes WHERE categoria = ?', [categoria], (err, result) => {
      if (err) {
        console.error('Error en getByCategoria:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  },

  // NUEVO: Obtener clientes por tipo
  getByTipo: (req, res) => {
    const { tipo } = req.params;
    db.query('SELECT * FROM clientes WHERE tipo = ?', [tipo], (err, result) => {
      if (err) {
        console.error('Error en getByTipo:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  },

  // NUEVO: Obtener clientes por estado
  getByEstado: (req, res) => {
    const { estado } = req.params;
    const activo = estado === 'activo' ? 1 : 0;
    db.query('SELECT * FROM clientes WHERE activo = ?', [activo], (err, result) => {
      if (err) {
        console.error('Error en getByEstado:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  }
};

module.exports = clientesController;