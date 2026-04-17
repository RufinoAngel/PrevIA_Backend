'use strict';

const express = require('express');
const router = express.Router();
const { 
  crearRegistroActividad,
  obtenerHistorialActividad,
  obtenerActividadPorFecha,
  actualizarRegistroActividad
} = require('../controllers/actividadFisicaController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, crearRegistroActividad);
router.get('/historial', verificarToken, obtenerHistorialActividad);
router.get('/fecha/:fecha', verificarToken, obtenerActividadPorFecha);
router.put('/:id', verificarToken, actualizarRegistroActividad);

module.exports = router;
