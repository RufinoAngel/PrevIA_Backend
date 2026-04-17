'use strict';

const express = require('express');
const router = express.Router();
const { 
  generarRecomendacionIA, // <-- Cambiamos el nombre aquí
  obtenerRecomendacionesUsuario, 
  completarRecomendacion 
} = require('../controllers/recomendacionesController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Cuando la app móvil llame a esta ruta, el backend hará la magia con la IA
router.post('/generar', verificarToken, generarRecomendacionIA); // <-- Y aquí

router.get('/', verificarToken, obtenerRecomendacionesUsuario);
router.put('/:id/completar', verificarToken, completarRecomendacion);

module.exports = router;