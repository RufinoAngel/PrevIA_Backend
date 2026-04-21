'use strict';

const express = require('express');
const router = express.Router();
const { obtenerPerfil, actualizarPerfil, obtenerMetasSalud, actualizarMetasSalud } = require('../controllers/perfilController');
const { verificarToken } = require('../middlewares/authMiddleware');


router.get('/', verificarToken, obtenerPerfil);
router.put('/', verificarToken, actualizarPerfil);
router.get('/metas', verificarToken, obtenerMetasSalud);
router.put('/metas', verificarToken, actualizarMetasSalud);

module.exports = router;
