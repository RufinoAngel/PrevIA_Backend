'use strict';

const express = require('express');
const router = express.Router();
const { 
  crearRegistroAlimentacion,
  obtenerHistorialAlimentacion,
  obtenerAlimentacionPorFecha,
  actualizarRegistroAlimentacion
} = require('../controllers/alimentacionController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, crearRegistroAlimentacion);
router.get('/historial', verificarToken, obtenerHistorialAlimentacion);
router.get('/fecha/:fecha', verificarToken, obtenerAlimentacionPorFecha);
router.put('/:id', verificarToken, actualizarRegistroAlimentacion);

module.exports = router;
