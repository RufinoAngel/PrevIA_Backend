const express = require('express');
const router = express.Router();
const { obtenerUsuarios, cambiarRol } = require('../controllers/adminController'); 
const { verificarToken } = require('../middlewares/authMiddleware'); 
const checkRole = require('../middlewares/roleAuth');

router.get('/usuarios', verificarToken, checkRole(['admin_previa']), obtenerUsuarios);
router.patch('/usuarios/:id/rol', verificarToken, checkRole(['admin_previa']), cambiarRol);

module.exports = router;