'use strict';

const express = require('express');
const router = express.Router();
const { otorgarMedalla, obtenerMedallasUsuario } = require('../controllers/medallasController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/otorgar', verificarToken, otorgarMedalla);
router.get('/', verificarToken, obtenerMedallasUsuario);

module.exports = router;
