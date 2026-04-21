'use strict';

const express = require('express');
const router = express.Router();
const { 
  registrarUsuario,loginUsuario,obtenerUsuarios,eliminarUsuario,olvidarPassword, resetearPassword
} = require('../controllers/userController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');


router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/', verificarToken, soloAdmin, obtenerUsuarios);
router.delete('/:id', verificarToken, soloAdmin, eliminarUsuario);
router.post('/olvide-password', olvidarPassword);
router.post('/reset-password/:token', resetearPassword);

module.exports = router;