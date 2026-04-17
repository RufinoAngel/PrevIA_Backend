'use strict';

const express = require('express');
const router = express.Router();
const { 
  registrarUsuario, 
  loginUsuario, 
  obtenerUsuarios, 
  eliminarUsuario, olvidarPassword, resetearPassword
} = require('../controllers/userController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');


router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

// Para llegar a obtenerUsuarios, primero debe tener token válido, y luego ser admin
router.get('/', verificarToken, soloAdmin, obtenerUsuarios);

// Para eliminar, aplica exactamente la misma seguridad
router.delete('/:id', verificarToken, soloAdmin, eliminarUsuario);

// Rutas para recuperación de contraseña
router.post('/olvide-password', olvidarPassword);
router.post('/reset-password/:token', resetearPassword);

module.exports = router;