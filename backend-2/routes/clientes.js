const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

// Rutas existentes
router.get('/', clientesController.getAll);
router.post('/', clientesController.create);
router.put('/:id', clientesController.update);
router.delete('/:id', clientesController.delete);

// Nuevas rutas
router.get('/:id', clientesController.getById);
router.get('/categoria/:categoria', clientesController.getByCategoria);
router.get('/tipo/:tipo', clientesController.getByTipo);
router.get('/estado/:estado', clientesController.getByEstado);

module.exports = router;