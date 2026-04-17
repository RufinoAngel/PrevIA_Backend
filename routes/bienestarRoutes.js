'use strict';

const express = require('express');
const router = express.Router();
const { 
  crearRegistroBienestar,
  obtenerHistorialUsuario,
  obtenerRegistroPorFecha,
  actualizarRegistroBienestar
} = require('../controllers/bienestarController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Todas estas rutas requieren que el usuario haya iniciado sesión (verificarToken)

// POST: Crear el registro del día
router.post('/', verificarToken, crearRegistroBienestar);

// GET: Obtener todo el historial del usuario logueado
router.get('/historial', verificarToken, obtenerHistorialUsuario);

// GET: Obtener un día específico (Ej: /api/bienestar/fecha/2026-03-12)
router.get('/fecha/:fecha', verificarToken, obtenerRegistroPorFecha);

// PUT: Actualizar un registro existente (Se pasa el _id de Mongo en la URL)
router.put('/:id', verificarToken, actualizarRegistroBienestar);

module.exports = router;