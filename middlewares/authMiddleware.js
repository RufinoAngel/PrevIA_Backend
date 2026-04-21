'use strict';

const jwt = require('jsonwebtoken');


const verificarToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado. Se requiere un token.' });
  }

  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido.' });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado; 
    next(); 
  } catch (error) {
    res.status(400).json({ error: 'Token inválido o expirado.' });
  }
};


const soloAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== 'admin_previa') {
    return res.status(403).json({ error: 'Acceso denegado. Exclusivo para Administradores.' });
  }
  next(); 
};

module.exports = {
  verificarToken,
  soloAdmin
};
