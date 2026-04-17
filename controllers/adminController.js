const pool = require('../config/db');

// Listar todos los usuarios para el panel de control
const obtenerUsuarios = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id_usuario AS id, 
        p.nombre, 
        u.email, 
        u.rol, 
        u.fecha_registro 
      FROM usuarios u
      LEFT JOIN perfiles p ON u.id_usuario = p.usuario_id
      ORDER BY u.fecha_registro DESC
    `;

    const [usuarios] = await pool.query(query);
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Cambiar el rol de un usuario específico
const cambiarRol = async (req, res) => {
  const { id } = req.params;
  const { nuevoRol } = req.body; // 'admin' o 'usuario'

  // Validar roles permitidos
  if (!['admin_previa', 'usuario_previa'].includes(nuevoRol)) {
    return res.status(400).json({ error: 'Rol no válido' });
  }

  // Prevención: El admin no puede degradarse a sí mismo
  if (parseInt(id) === req.usuario.id && nuevoRol !== 'admin_previa') {
    return res.status(400).json({ error: 'No puedes quitarte los permisos de admin a ti mismo.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE usuarios SET rol = ? WHERE id_usuario = ?',
      [nuevoRol, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: `El usuario ahora tiene el rol: ${nuevoRol}` });
  } catch (error) {
    console.error('Error al cambiar rol:', error);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
};

module.exports = { obtenerUsuarios, cambiarRol };