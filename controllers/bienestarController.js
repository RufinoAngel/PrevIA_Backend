'use strict';

const RegistroBienestar = require('../models/RegistroBienestar');
const crearRegistroBienestar = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { fecha, vasosAgua, estadoAnimo, nivelEstres } = req.body;

    if (!fecha || vasosAgua === undefined || !estadoAnimo || !nivelEstres) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setUTCHours(0, 0, 0, 0);
    const registroGuardado = await RegistroBienestar.findOneAndUpdate(
      { 
        usuario_id: usuarioId, 
        fecha: fechaNormalizada 
      }, 
      { 
        $set: {
          vasos_agua_consumidos: vasosAgua,
          estado_animo: estadoAnimo,
          nivel_estres: nivelEstres
        }
      }, 
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      mensaje: 'Bienestar diario guardado con éxito',
      datos: registroGuardado
    });
  } catch (error) {
    console.error('Error en crearRegistroBienestar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerHistorialUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    
    const historial = await RegistroBienestar.find({ usuario_id: usuarioId })
      .sort({ fecha: -1 });

    res.status(200).json(historial);
  } catch (error) {
    console.error('Error en obtenerHistorialUsuario:', error);
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
};

const obtenerRegistroPorFecha = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { fecha } = req.params;

    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setUTCHours(0, 0, 0, 0);

    const registro = await RegistroBienestar.findOne({ 
      usuario_id: usuarioId, 
      fecha: fechaNormalizada 
    });

    if (!registro) {
      return res.status(404).json({ mensaje: 'No hay registro para esta fecha' });
    }

    res.status(200).json(registro);
  } catch (error) {
    console.error('Error en obtenerRegistroPorFecha:', error);
    res.status(500).json({ error: 'Error al buscar el registro' });
  }
};

const actualizarRegistroBienestar = async (req, res) => {
  try {
    const { id } = req.params;
    const { vasosAgua, estadoAnimo, nivelEstres } = req.body;
    const usuarioId = req.usuario.id;

    const registroActualizado = await RegistroBienestar.findOneAndUpdate(
      { _id: id, usuario_id: usuarioId }, 
      { 
        vasos_agua_consumidos: vasosAgua,
        estado_animo: estadoAnimo,
        nivel_estres: nivelEstres
      },
      { new: true, runValidators: true } 
    );

    if (!registroActualizado) {
      return res.status(404).json({ error: 'Registro no encontrado o no tienes permiso para editarlo' });
    }

    res.status(200).json({
      mensaje: 'Registro actualizado correctamente',
      datos: registroActualizado
    });
  } catch (error) {
    console.error('Error en actualizarRegistroBienestar:', error);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
};

module.exports = {
  crearRegistroBienestar,
  obtenerHistorialUsuario,
  obtenerRegistroPorFecha,
  actualizarRegistroBienestar
};
