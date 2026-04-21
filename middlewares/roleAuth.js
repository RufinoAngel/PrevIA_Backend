const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        error: 'Acceso denegado', 
        mensaje: 'Tu cuenta no tiene permisos de administrador para ver esto.' 
      });
    }

    next();
  };
};

module.exports = checkRole;
