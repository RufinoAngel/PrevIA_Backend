'use strict';

const express = require('express');
const router = express.Router();
const { obtenerPerfil, actualizarPerfil, obtenerMetasSalud, actualizarMetasSalud } = require('../controllers/perfilController');
const { verificarToken } = require('../middlewares/authMiddleware');

// GET: Cargar la pantalla de perfil en la app
router.get('/', verificarToken, obtenerPerfil);

// PUT: Guardar los cambios desde el formulario de la app
router.put('/', verificarToken, actualizarPerfil);

// GET: Obtener metas de salud
router.get('/metas', verificarToken, obtenerMetasSalud);

// PUT: Actualizar metas de salud
router.put('/metas', verificarToken, actualizarMetasSalud);

module.exports = router;
