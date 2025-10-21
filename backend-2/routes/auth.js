const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register); // ← Nueva ruta
router.get('/verify', authController.verify);

module.exports = router;