'use strict';

const express = require('express');
const router = express.Router();
const { otorgarMedalla, obtenerMedallasUsuario } = require('../controllers/medallasController');
const { verificarToken } = require('../middlewares/authMiddleware');

// POST: La lógica interna (o el admin) le otorga una medalla
router.post('/otorgar', verificarToken, otorgarMedalla);

// GET: El usuario ve todas las medallas que ha ganado
router.get('/', verificarToken, obtenerMedallasUsuario);

module.exports = router;
