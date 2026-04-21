'use strict';

const pool = require('../config/db');


const otorgarMedalla = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { nombreMedalla, descripcionMedalla, iconoUrl } = req.body;

    if (!nombreMedalla || !descripcionMedalla) {
      return res.status(400).json({ error: 'El nombre y descripción de la medalla son obligatorios' });
    }

    const query = `
      INSERT INTO usuario_medallas (usuario_id, nombre_medalla, descripcion_medalla, icono_url)
      VALUES (?, ?, ?, ?)
    `;
    
    const [resultado] = await pool.query(query, [usuarioId, nombreMedalla, descripcionMedalla, iconoUrl || null]);

    res.status(201).json({
      mensaje: '¡Felicidades! Has obtenido una nueva medalla',
      id_medalla_otorgada: resultado.insertId
    });
  } catch (error) {
    console.error('Error en otorgarMedalla:', error);
    res.status(500).json({ error: 'Error interno al otorgar la medalla' });
  }
};


const obtenerMedallasUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    
    const query = `
      SELECT id_medalla, nombre_medalla, descripcion_medalla, icono_url, fecha_obtenida 
      FROM usuario_medallas 
      WHERE usuario_id = ?
      ORDER BY fecha_obtenida DESC
    `;
    
    const [medallas] = await pool.query(query, [usuarioId]);

    res.status(200).json(medallas);
  } catch (error) {
    console.error('Error en obtenerMedallasUsuario:', error);
    res.status(500).json({ error: 'Error al cargar la vitrina de medallas' });
  }
};

module.exports = {
  otorgarMedalla,
  obtenerMedallasUsuario
};
