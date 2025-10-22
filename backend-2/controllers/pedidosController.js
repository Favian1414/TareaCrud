const db = require('../config/database');

const pedidosController = {
  // Obtener todos los pedidos con información de cliente y detalles
  getAll: (req, res) => {
    const query = `
      SELECT 
        p.*,
        c.nombre as cliente_nombre,
        c.apellido as cliente_apellido,
        c.email as cliente_email,
        (SELECT COUNT(*) FROM pedido_detalles pd WHERE pd.pedido_id = p.id) as total_productos,
        (SELECT SUM(pd.cantidad) FROM pedido_detalles pd WHERE pd.pedido_id = p.id) as total_items
      FROM pedidos_nuevos p  -- CAMBIADO AQUÍ
      LEFT JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.created_at DESC
    `;
    
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error en getAll pedidos:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  },

  // Obtener detalles completos de un pedido específico
  getById: (req, res) => {
    const { id } = req.params;
    
    const pedidoQuery = `
      SELECT 
        p.*,
        c.nombre as cliente_nombre,
        c.apellido as cliente_apellido,
        c.email as cliente_email,
        c.telefono as cliente_telefono,
        c.direccion as cliente_direccion
      FROM pedidos_nuevos p  -- CAMBIADO AQUÍ
      LEFT JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = ?
    `;
    
    const detallesQuery = `
      SELECT 
        pd.*,
        pr.nombre as producto_nombre,
        pr.descripcion as producto_descripcion,
        pr.imagen as producto_imagen
      FROM pedido_detalles pd
      LEFT JOIN productos pr ON pd.producto_id = pr.id
      WHERE pd.pedido_id = ?
    `;

    db.query(pedidoQuery, [id], (err, pedidoResult) => {
      if (err) {
        console.error('Error en getById pedido:', err);
        return res.status(500).json({ error: err.message });
      }

      if (pedidoResult.length === 0) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      const pedido = pedidoResult[0];

      db.query(detallesQuery, [id], (err, detallesResult) => {
        if (err) {
          console.error('Error en getById detalles:', err);
          return res.status(500).json({ error: err.message });
        }

        res.json({
          ...pedido,
          detalles: detallesResult
        });
      });
    });
  },

  // Crear nuevo pedido con múltiples productos
  create: (req, res) => {
    const { 
      cliente_id, 
      fecha_pedido, 
      fecha_entrega, 
      estado, 
      metodo_pago, 
      notas,
      productos // Array de productos
    } = req.body;

    console.log('📦 Datos recibidos para crear pedido:', req.body);

    // Validaciones básicas
    if (!cliente_id) {
      return res.status(400).json({ error: 'El cliente es requerido' });
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un producto' });
    }

    // Validar que todos los productos tengan los campos requeridos
    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      if (!producto.producto_id) {
        return res.status(400).json({ error: `El producto en posición ${i + 1} no tiene ID` });
      }
      if (!producto.cantidad || producto.cantidad <= 0) {
        return res.status(400).json({ error: `La cantidad del producto en posición ${i + 1} es inválida` });
      }
      if (!producto.precio_unitario || producto.precio_unitario < 0) {
        return res.status(400).json({ error: `El precio del producto en posición ${i + 1} es inválido` });
      }
    }

    // Generar código de pedido único
    const codigo_pedido = 'PED-' + Date.now();

    // Calcular subtotal y total
    let subtotal = 0;
    subtotal = productos.reduce((sum, producto) => {
      return sum + (producto.cantidad * producto.precio_unitario);
    }, 0);
    
    const impuestos = subtotal * 0.18; // 18% de IGV
    const total = subtotal + impuestos;

    console.log('💰 Cálculos:', { subtotal, impuestos, total });

    // Insertar el pedido principal
    const pedidoQuery = `
      INSERT INTO pedidos_nuevos (  -- CAMBIADO AQUÍ
        codigo_pedido, cliente_id, fecha_pedido, fecha_entrega, estado,
        subtotal, impuestos, total, metodo_pago, notas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(pedidoQuery, [
      codigo_pedido, 
      cliente_id, 
      fecha_pedido || new Date().toISOString().split('T')[0], 
      fecha_entrega, 
      estado || 'pendiente', 
      subtotal, 
      impuestos, 
      total, 
      metodo_pago, 
      notas
    ], (err, result) => {
      if (err) {
        console.error('❌ Error en create pedido:', err);
        return res.status(500).json({ error: err.message });
      }

      const pedidoId = result.insertId;
      console.log('✅ Pedido principal creado con ID:', pedidoId);

      // Insertar los detalles del pedido
      const detallesQueries = productos.map((producto, index) => {
        return new Promise((resolve, reject) => {
          console.log(`📝 Insertando producto ${index + 1}:`, producto);
          
          db.query(
            'INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
            [
              pedidoId, 
              producto.producto_id, 
              producto.cantidad, 
              producto.precio_unitario
            ],
            (err, result) => {
              if (err) {
                console.error(`❌ Error insertando producto ${index + 1}:`, err);
                reject(err);
              } else {
                console.log(`✅ Producto ${index + 1} insertado correctamente`);
                resolve(result);
              }
            }
          );
        });
      });

      // Ejecutar todas las inserciones de detalles
      Promise.all(detallesQueries)
        .then(() => {
          console.log('🎉 Todos los productos insertados correctamente');
          // Devolver el pedido creado con sus detalles
          pedidosController.getById({ params: { id: pedidoId } }, res);
        })
        .catch(error => {
          console.error('💥 Error creando detalles del pedido:', error);
          
          // Si falla la inserción de detalles, eliminar el pedido principal
          db.query('DELETE FROM pedidos_nuevos WHERE id = ?', [pedidoId], (deleteErr) => {  // CAMBIADO AQUÍ
            if (deleteErr) {
              console.error('Error eliminando pedido principal:', deleteErr);
            }
          });
          
          res.status(500).json({ error: 'Error creando detalles del pedido: ' + error.message });
        });
    });
  },

  // Actualizar pedido
  update: (req, res) => {
    const { id } = req.params;
    const { 
      cliente_id, 
      fecha_pedido, 
      fecha_entrega, 
      estado, 
      metodo_pago, 
      notas 
    } = req.body;

    db.query(
      `UPDATE pedidos_nuevos SET  -- CAMBIADO AQUÍ
        cliente_id=?, fecha_pedido=?, fecha_entrega=?, estado=?, 
        metodo_pago=?, notas=?
      WHERE id=?`,
      [cliente_id, fecha_pedido, fecha_entrega, estado, metodo_pago, notas, id],
      (err) => {
        if (err) {
          console.error('Error en update pedido:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Pedido actualizado' });
      }
    );
  },

  // Eliminar pedido
  delete: (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM pedidos_nuevos WHERE id=?', [id], (err) => {  // CAMBIADO AQUÍ
      if (err) {
        console.error('Error en delete pedido:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ mensaje: 'Pedido eliminado' });
    });
  },

  // Agregar producto a un pedido existente
  agregarProducto: (req, res) => {
    const { id } = req.params;
    const { producto_id, cantidad, precio_unitario } = req.body;

    // Validaciones
    if (!producto_id) {
      return res.status(400).json({ error: 'El producto_id es requerido' });
    }
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ error: 'La cantidad es requerida y debe ser mayor a 0' });
    }
    if (!precio_unitario || precio_unitario < 0) {
      return res.status(400).json({ error: 'El precio unitario es requerido y debe ser mayor o igual a 0' });
    }

    db.query(
      'INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
      [id, producto_id, cantidad, precio_unitario],
      (err, result) => {
        if (err) {
          console.error('Error en agregarProducto:', err);
          return res.status(500).json({ error: err.message });
        }

        // Recalcular totales del pedido
        pedidosController.recalcularTotales(id);
        
        res.json({ 
          mensaje: 'Producto agregado al pedido',
          detalle_id: result.insertId 
        });
      }
    );
  },

  // Eliminar producto de un pedido
  eliminarProducto: (req, res) => {
    const { id, detalle_id } = req.params;

    db.query('DELETE FROM pedido_detalles WHERE id=? AND pedido_id=?', [detalle_id, id], (err) => {
      if (err) {
        console.error('Error en eliminarProducto:', err);
        return res.status(500).json({ error: err.message });
      }

      // Recalcular totales del pedido
      pedidosController.recalcularTotales(id);
      
      res.json({ mensaje: 'Producto eliminado del pedido' });
    });
  },

  // Función auxiliar para recalcular totales
  recalcularTotales: (pedidoId) => {
    const query = `
      UPDATE pedidos_nuevos p  -- CAMBIADO AQUÍ
      SET 
        subtotal = (SELECT COALESCE(SUM(cantidad * precio_unitario), 0) FROM pedido_detalles WHERE pedido_id = p.id),
        impuestos = (SELECT COALESCE(SUM(cantidad * precio_unitario) * 0.18, 0) FROM pedido_detalles WHERE pedido_id = p.id),
        total = (SELECT COALESCE(SUM(cantidad * precio_unitario) * 1.18, 0) FROM pedido_detalles WHERE pedido_id = p.id)
      WHERE p.id = ?
    `;
    
    db.query(query, [pedidoId], (err) => {
      if (err) {
        console.error('Error recalculando totales:', err);
      }
    });
  }
};

module.exports = pedidosController;