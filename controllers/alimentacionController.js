'use strict';

const RegistroAlimentacion = require('../models/RegistroAlimentacion');
const crearRegistroAlimentacion = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { fecha, tipoComida, descripcionCorta, horaRegistro } = req.body;

    if (!fecha || !tipoComida || !descripcionCorta || !horaRegistro) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setUTCHours(0, 0, 0, 0);

    const nuevoRegistro = new RegistroAlimentacion({
      usuario_id: usuarioId,
      fecha: fechaNormalizada,
      tipo_comida: tipoComida,
      descripcion_corta: descripcionCorta,
      hora_registro: horaRegistro
    });

    const registroGuardado = await nuevoRegistro.save();

    res.status(201).json({
      mensaje: 'Comida registrada con éxito',
      datos: registroGuardado
    });
  } catch (error) {
    console.error('Error en crearRegistroAlimentacion:', error);
    res.status(500).json({ error: 'Error interno al registrar la comida' });
  }
};

const obtenerHistorialAlimentacion = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    
    const historial = await RegistroAlimentacion.find({ usuario_id: usuarioId })
      .sort({ fecha: -1, hora_registro: -1 });

    res.status(200).json(historial);
  } catch (error) {
    console.error('Error en obtenerHistorialAlimentacion:', error);
    res.status(500).json({ error: 'Error al obtener el historial de alimentación' });
  }
};

const obtenerAlimentacionPorFecha = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { fecha } = req.params;
    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setUTCHours(0, 0, 0, 0);
    const registrosDelDia = await RegistroAlimentacion.find({ 
      usuario_id: usuarioId, 
      fecha: fechaNormalizada 
    }).sort({ hora_registro: 1 });
    res.status(200).json(registrosDelDia);
  } catch (error) {
    console.error('Error en obtenerAlimentacionPorFecha:', error);
    res.status(500).json({ error: 'Error al buscar los registros de comida' });
  }
};
const actualizarRegistroAlimentacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoComida, descripcionCorta, horaRegistro } = req.body;
    const usuarioId = req.usuario.id;

    const registroActualizado = await RegistroAlimentacion.findOneAndUpdate(
      { _id: id, usuario_id: usuarioId }, 
      { 
        tipo_comida: tipoComida,
        descripcion_corta: descripcionCorta,
        hora_registro: horaRegistro
      },
      { new: true, runValidators: true }
    );

    if (!registroActualizado) {
      return res.status(404).json({ error: 'Registro no encontrado o sin permisos' });
    }

    res.status(200).json({
      mensaje: 'Registro de comida actualizado',
      datos: registroActualizado
    });
  } catch (error) {
    console.error('Error en actualizarRegistroAlimentacion:', error);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
};

module.exports = {
  crearRegistroAlimentacion,
  obtenerHistorialAlimentacion,
  obtenerAlimentacionPorFecha,
  actualizarRegistroAlimentacion
};
