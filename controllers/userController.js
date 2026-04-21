'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const nodemailer = require('nodemailer');




const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const olvidarPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const query = `
      SELECT u.id_usuario, p.nombre 
      FROM usuarios u
      LEFT JOIN perfiles p ON u.id_usuario = p.usuario_id
      WHERE u.email = ?
    `;
    const [user] = await pool.query(query, [email]);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'No existe una cuenta con este correo.' });
    }

    const usuario = user[0];
    const nombreUsuario = usuario.nombre || 'Usuario'; 
    const tokenRecuperacion = jwt.sign(
      { id: usuario.id_usuario }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );
    const link = `${process.env.FRONTEND_URL}/reset-password/${tokenRecuperacion}`;

    await transporter.sendMail({
      from: '"Soporte PrevIA" <no-reply@previa.com>',
      to: email,
      subject: 'Recuperación de Contraseña - PrevIA',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 2px solid #BBE6E4; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #004F6D; padding: 25px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 800;">Prev<span style="color: #BBE6E4;">IA</span></h1>
          </div>
          <div style="padding: 30px; color: #000000;">
            <h2 style="color: #02746E; margin-top: 0; font-size: 22px;">¡Hola, ${nombreUsuario}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #000000;">
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en nuestra plataforma.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #000000;">
              Para recuperar tu acceso, haz clic en el siguiente botón. Por seguridad, <strong>este enlace expirará en 15 minutos</strong>.
            </p>
            <div style="text-align: center; margin: 35px 0;">
              <a href="${link}" style="background-color: #02746E; color: #FFFFFF; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                Restablecer Contraseña
              </a>
            </div>
            <div style="margin-top: 40px; border-top: 2px solid #BBE6E4; padding-top: 20px;">
              <p style="font-size: 13px; color: #004F6D; line-height: 1.5; margin: 0;">
                Si tú no solicitaste este cambio, puedes ignorar este correo. Tu cuenta y tu información siguen estando seguras.
              </p>
            </div>
          </div>
        </div>
      `
    });

    res.json({ mensaje: 'Correo de recuperación enviado con éxito. Revisa tu bandeja.' });
  } catch (error) {
    console.error('Error en olvidarPassword:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
};

const resetearPassword = async (req, res) => {
  const { token } = req.params;
  const { nuevaPassword } = req.body;

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    const idUsuario = decodificado.id;
    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(nuevaPassword, salt);
    const [result] = await pool.query(
      'UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?',
      [passwordHasheada, idUsuario]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json({ mensaje: '¡Contraseña actualizada correctamente! Ya puedes iniciar sesión.' });
  } catch (error) {
    console.error('Error en resetearPassword:', error);
    res.status(400).json({ error: 'El enlace de recuperación es inválido o ha expirado.' });
  }
};


const registrarUsuario = async (req, res) => {
  try {
    const { email, password, authProvider = 'local', aceptaIa = true, rol = 'usuario_previa' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'El email y la contraseña son obligatorios' });
    }

    const [usuariosExistentes] = await pool.query(
      'SELECT email FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ error: 'Este correo ya está registrado en PrevIA' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO usuarios (email, password_hash, auth_provider, acepta_ia, rol)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [resultado] = await pool.query(query, [email, passwordHash, authProvider, aceptaIa, rol]);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      id_usuario: resultado.insertId,
      rol: rol
    });
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    res.status(500).json({ error: 'Error interno del servidor al registrar usuario' });
  }
};


const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const [usuarios] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    
    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token: token,
      usuario: {
        id: usuario.id_usuario,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' });
  }
};


const obtenerUsuarios = async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      'SELECT id_usuario, email, auth_provider, acepta_ia, fecha_registro, rol FROM usuarios'
    );
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error en obtenerUsuarios:', error);
    res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
  }
};


const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [resultado] = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente de PrevIA' });
  } catch (error) {
    console.error('Error en eliminarUsuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  olvidarPassword,
  resetearPassword,
  registrarUsuario,
  loginUsuario,
  obtenerUsuarios,
  eliminarUsuario
};
