'use strict';

const express = require('express');
const router = express.Router();
const { 
  crearRegistroBienestar,
  obtenerHistorialUsuario,
  obtenerRegistroPorFecha,
  actualizarRegistroBienestar
} = require('../controllers/bienestarController');
const { verificarToken } = require('../middlewares/authMiddleware');
router.post('/', verificarToken, crearRegistroBienestar);
router.get('/historial', verificarToken, obtenerHistorialUsuario);
router.get('/fecha/:fecha', verificarToken, obtenerRegistroPorFecha);
router.put('/:id', verificarToken, actualizarRegistroBienestar);

module.exports = router;