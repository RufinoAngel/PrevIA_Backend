'use strict';

const express = require('express');
const router = express.Router();
const { actualizarRacha, obtenerRachasUsuario } = require('../controllers/rachasController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, actualizarRacha);
router.get('/', verificarToken, obtenerRachasUsuario);

module.exports = router;
