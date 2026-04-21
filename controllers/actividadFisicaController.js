'use strict';

const RegistroActividadFisica = require('../models/RegistroActividadFisica');
const crearRegistroActividad = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { fecha, tipoEjercicio, duracionMinutos, intensidad } = req.body;

    if (!fecha || !tipoEjercicio || duracionMinutos === undefined || !intensidad) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setUTCHours(0, 0, 0, 0);

    const nuevoRegistro = new RegistroActividadFisica({
      usuario_id: usuarioId,
      fecha: fechaNormalizada,
      tipo_ejercicio: tipoEjercicio,
      duracion_minutos: duracionMinutos,
      intensidad: intensidad
    });

    const registroGuardado = await nuevoRegistro.save();

    res.status(201).json({
      mensaje: 'Actividad física registrada con éxito',
      datos: registroGuardado
    });
  } catch (error) {
    console.error('Error en crearRegistroActividad:', error);
    res.status(500).json({ error: 'Error interno al registrar la actividad física' });
  }
};
const obtenerHistorialActividad = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    
    const historial = await RegistroActividadFisica.find({ usuario_id: usuarioId })
      .sort({ fecha: -1, createdAt: -1 }); 

    res.status(200).json(historial);
  } catch (error) {
    console.error('Error en obtenerHistorialActividad:', error);
    res.status(500).json({ error: 'Error al obtener el historial de actividad' });
  }
};

const obtenerActividadPorFecha = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { fecha } = req.params;

    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setUTCHours(0, 0, 0, 0);

    const registrosDelDia = await RegistroActividadFisica.find({ 
      usuario_id: usuarioId, 
      fecha: fechaNormalizada 
    }).sort({ createdAt: 1 });

    res.status(200).json(registrosDelDia);
  } catch (error) {
    console.error('Error en obtenerActividadPorFecha:', error);
    res.status(500).json({ error: 'Error al buscar los registros de actividad' });
  }
};

const actualizarRegistroActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoEjercicio, duracionMinutos, intensidad } = req.body;
    const usuarioId = req.usuario.id;

    const registroActualizado = await RegistroActividadFisica.findOneAndUpdate(
      { _id: id, usuario_id: usuarioId }, 
      { 
        tipo_ejercicio: tipoEjercicio,
        duracion_minutos: duracionMinutos,
        intensidad: intensidad
      },
      { new: true, runValidators: true }
    );

    if (!registroActualizado) {
      return res.status(404).json({ error: 'Registro no encontrado o sin permisos' });
    }

    res.status(200).json({
      mensaje: 'Registro de actividad actualizado',
      datos: registroActualizado
    });
  } catch (error) {
    console.error('Error en actualizarRegistroActividad:', error);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
};

module.exports = {
  crearRegistroActividad,
  obtenerHistorialActividad,
  obtenerActividadPorFecha,
  actualizarRegistroActividad
};
