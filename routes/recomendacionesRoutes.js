'use strict';

const express = require('express');
const router = express.Router();
const { 
  generarRecomendacionIA,
  obtenerRecomendacionesUsuario, 
  completarRecomendacion 
} = require('../controllers/recomendacionesController');
const { verificarToken } = require('../middlewares/authMiddleware');
router.post('/generar', verificarToken, generarRecomendacionIA); 
router.get('/', verificarToken, obtenerRecomendacionesUsuario);
router.put('/:id/completar', verificarToken, completarRecomendacion);

module.exports = router;