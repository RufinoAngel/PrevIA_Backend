'use strict';

const pool = require('../config/db');

// 1. OBTENER PERFIL Y METAS DEL USUARIO
// OBTENER EL PERFIL DEL USUARIO
const obtenerPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // LA NUEVA SÚPER CONSULTA
    const query = `
      SELECT 
        p.nombre, 
        p.fecha_nacimiento, 
        p.peso, 
        p.altura, 
        p.genero,
        u.email,
        TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad_calculada
      FROM perfiles p
      INNER JOIN usuarios u ON p.usuario_id = u.id_usuario
      WHERE p.usuario_id = ?
    `;

    const [resultados] = await pool.query(query, [usuarioId]);

    if (resultados.length === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    // Le devolvemos el primer (y único) resultado a React
    res.status(200).json(resultados[0]);

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
// 2. CREAR O ACTUALIZAR PERFIL Y METAS (Upsert)
const actualizarPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { 
      nombre, fechaNacimiento, peso, altura, genero
    } = req.body;

    // Validación básica
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    // Insertar o actualizar Perfil
    const queryPerfil = `
      INSERT INTO perfiles (usuario_id, nombre, fecha_nacimiento, peso, altura, genero)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        nombre = VALUES(nombre), 
        fecha_nacimiento = VALUES(fecha_nacimiento), 
        peso = VALUES(peso), 
        altura = VALUES(altura), 
        genero = VALUES(genero)
    `;
    await pool.query(queryPerfil, [usuarioId, nombre, fechaNacimiento, peso, altura, genero]);

    res.status(200).json({ mensaje: '¡Tu perfil se ha guardado exitosamente!' });
  } catch (error) {
    console.error('Error en actualizarPerfil:', error);
    res.status(500).json({ error: 'Error interno al guardar el perfil' });
  }
};
const obtenerConfiguracion = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // Extraído del token JWT

    // Consulta a MySQL (Asegúrate de que estas columnas existan en tu tabla)
    const [rows] = await pool.query(
      `SELECT notificaciones_recordatorios, notificaciones_resumen, 
                    perfil_publico, compartir_datos, sistema_unidades
             FROM usuarios WHERE id = ?`, 
      [usuarioId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error del servidor al obtener configuraciones' });
  }
};

// 2. ACTUALIZAR LAS CONFIGURACIONES Y METAS
const actualizarConfiguracion = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { 
      notificaciones_recordatorios, 
      notificaciones_resumen, 
      perfil_publico, 
      compartir_datos, 
      sistema_unidades
    } = req.body;

    // Actualización en MySQL
    const [result] = await pool.query(
      `UPDATE usuarios SET 
                notificaciones_recordatorios = ?, 
                notificaciones_resumen = ?, 
                perfil_publico = ?, 
                compartir_datos = ?, 
                sistema_unidades = ?
             WHERE id = ?`,
      [
        notificaciones_recordatorios, 
        notificaciones_resumen, 
        perfil_publico, 
        compartir_datos, 
        sistema_unidades, 
        usuarioId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se pudo actualizar o el usuario no existe' });
    }

    res.status(200).json({ mensaje: 'Configuraciones actualizadas con éxito' });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error del servidor al actualizar configuraciones' });
  }
};

const obtenerMetasSalud = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const [rows] = await pool.query(
      `SELECT meta_agua_vasos, meta_sueno_horas, meta_ejercicio_minutos 
             FROM metas_configuracion WHERE usuario_id = ?`, 
      [usuarioId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Metas no encontradas' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener metas de salud:', error);
    res.status(500).json({ error: 'Error del servidor al obtener metas de salud' });
  }
};

const actualizarMetasSalud = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { meta_agua_vasos, meta_sueno_horas, meta_ejercicio_minutos } = req.body;

    await pool.query(
      `INSERT INTO metas_configuracion (usuario_id, meta_agua_vasos, meta_sueno_horas, meta_ejercicio_minutos)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
               meta_agua_vasos = VALUES(meta_agua_vasos), 
               meta_sueno_horas = VALUES(meta_sueno_horas), 
               meta_ejercicio_minutos = VALUES(meta_ejercicio_minutos)`,
      [usuarioId, meta_agua_vasos, meta_sueno_horas, meta_ejercicio_minutos]
    );

    res.status(200).json({ mensaje: 'Metas de salud actualizadas con éxito' });
  } catch (error) {
    console.error('Error al actualizar metas de salud:', error);
    res.status(500).json({ error: 'Error del servidor al actualizar metas de salud' });
  }
};

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion,
  obtenerPerfil,
  actualizarPerfil,
  obtenerMetasSalud,
  actualizarMetasSalud
};
