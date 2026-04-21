'use strict';

const RegistroSueno = require('../models/RegistroSueno');


const crearRegistroSueno = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { fecha, horasDormidas, calidad, horaAcostarse, horaDespertar } = req.body;

    if (!fecha || horasDormidas === undefined || !calidad || !horaAcostarse || !horaDespertar) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setUTCHours(0, 0, 0, 0);

    const nuevoRegistro = new RegistroSueno({
      usuario_id: usuarioId,
      fecha: fechaNormalizada,
      horas_dormidas: horasDormidas,
      calidad: calidad,
      hora_acostarse: horaAcostarse,
      hora_despertar: horaDespertar
    });

    const registroGuardado = await nuevoRegistro.save();

    res.status(201).json({
      mensaje: 'Registro de sueño guardado con éxito',
      datos: registroGuardado
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Ya guardaste tu registro de sueño para esta fecha.' });
    }
    console.error('Error en crearRegistroSueno:', error);
    res.status(500).json({ error: 'Error interno del servidor al guardar el sueño' });
  }
};


const obtenerHistorialSueno = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    
    const historial = await RegistroSueno.find({ usuario_id: usuarioId })
      .sort({ fecha: -1 });

    res.status(200).json(historial);
  } catch (error) {
    console.error('Error en obtenerHistorialSueno:', error);
    res.status(500).json({ error: 'Error al obtener el historial de sueño' });
  }
};


const obtenerSuenoPorFecha = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { fecha } = req.params;

    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setUTCHours(0, 0, 0, 0);

    const registro = await RegistroSueno.findOne({ 
      usuario_id: usuarioId, 
      fecha: fechaNormalizada 
    });

    if (!registro) {
      return res.status(404).json({ mensaje: 'No hay registro de sueño para esta fecha' });
    }

    res.status(200).json(registro);
  } catch (error) {
    console.error('Error en obtenerSuenoPorFecha:', error);
    res.status(500).json({ error: 'Error al buscar el registro de sueño' });
  }
};


const actualizarRegistroSueno = async (req, res) => {
  try {
    const { id } = req.params;
    const { horasDormidas, calidad, horaAcostarse, horaDespertar } = req.body;
    const usuarioId = req.usuario.id;

    const registroActualizado = await RegistroSueno.findOneAndUpdate(
      { _id: id, usuario_id: usuarioId }, 
      { 
        horas_dormidas: horasDormidas,
        calidad: calidad,
        hora_acostarse: horaAcostarse,
        hora_despertar: horaDespertar
      },
      { new: true, runValidators: true }
    );

    if (!registroActualizado) {
      return res.status(404).json({ error: 'Registro no encontrado o sin permisos' });
    }

    res.status(200).json({
      mensaje: 'Registro de sueño actualizado',
      datos: registroActualizado
    });
  } catch (error) {
    console.error('Error en actualizarRegistroSueno:', error);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
};

module.exports = {
  crearRegistroSueno,
  obtenerHistorialSueno,
  obtenerSuenoPorFecha,
  actualizarRegistroSueno
};
