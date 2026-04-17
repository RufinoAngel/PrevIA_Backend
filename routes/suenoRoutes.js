'use strict';

const express = require('express');
const router = express.Router();
const { 
  crearRegistroSueno,
  obtenerHistorialSueno,
  obtenerSuenoPorFecha,
  actualizarRegistroSueno
} = require('../controllers/suenoController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, crearRegistroSueno);
router.get('/historial', verificarToken, obtenerHistorialSueno);
router.get('/fecha/:fecha', verificarToken, obtenerSuenoPorFecha);
router.put('/:id', verificarToken, actualizarRegistroSueno);

module.exports = router;
