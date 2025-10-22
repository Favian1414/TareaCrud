const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Rutas principales
router.get('/', pedidosController.getAll);
router.get('/:id', pedidosController.getById);
router.post('/', pedidosController.create);
router.put('/:id', pedidosController.update);
router.delete('/:id', pedidosController.delete);

// Rutas para gestión de productos en pedidos
router.post('/:id/productos', pedidosController.agregarProducto);
router.delete('/:id/productos/:detalle_id', pedidosController.eliminarProducto);

module.exports = router;