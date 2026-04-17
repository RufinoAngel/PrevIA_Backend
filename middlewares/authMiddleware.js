'use strict';

const jwt = require('jsonwebtoken');

// 1er Guardia: Verifica que la persona tenga un Token válido (que haya iniciado sesión)
const verificarToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado. Se requiere un token.' });
  }

  const token = authHeader.split(' ')[1]; // Separa la palabra "Bearer" del token real

  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido.' });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado; // Guardamos los datos del token (incluyendo el rol) en la petición
    next(); // Pásale el control a la siguiente función
  } catch (error) {
    res.status(400).json({ error: 'Token inválido o expirado.' });
  }
};

// 2do Guardia: Verifica que el rol específico sea admin_previa
const soloAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== 'admin_previa') {
    return res.status(403).json({ error: 'Acceso denegado. Exclusivo para Administradores.' });
  }
  next(); // Si es admin, déjalo pasar a la función de borrar o ver usuarios
};

module.exports = {
  verificarToken,
  soloAdmin
};
