'use strict';

const HistorialRachas = require('../models/HistorialRachas');


const actualizarRacha = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { habito, fechaActualizacion } = req.body;

    if (!habito || !fechaActualizacion) {
      return res.status(400).json({ error: 'El hábito y la fecha son obligatorios' });
    }

    
    const hoy = new Date(fechaActualizacion);
    hoy.setUTCHours(0, 0, 0, 0);

    
    let racha = await HistorialRachas.findOne({ usuario_id: usuarioId, habito: habito });

    if (!racha) {
      
      const nuevaRacha = new HistorialRachas({
        usuario_id: usuarioId,
        habito: habito,
        dias_consecutivos: 1,
        ultima_actualizacion: hoy
      });
      await nuevaRacha.save();
      return res.status(200).json({ mensaje: '¡Primera racha iniciada!', datos: nuevaRacha });
    }

    
    const ultimaFecha = new Date(racha.ultima_actualizacion);
    ultimaFecha.setUTCHours(0, 0, 0, 0);

    
    const diferenciaTiempo = hoy.getTime() - ultimaFecha.getTime();
    const diferenciaDias = Math.round(diferenciaTiempo / (1000 * 3600 * 24));

    console.log(`[RACHAS] Hábito: ${habito} | Dif. Días: ${diferenciaDias} | Racha actual: ${racha.dias_consecutivos}`);

    if (diferenciaDias === 0) {
      
      return res.status(200).json({ mensaje: 'La racha ya fue actualizada el día de hoy', datos: racha });
    } else if (diferenciaDias === 1) {
      
      racha.dias_consecutivos += 1;
      racha.ultima_actualizacion = hoy;
      await racha.save();
      return res.status(200).json({ mensaje: '¡Racha aumentada!', datos: racha });
    } else if (diferenciaDias > 1) {
      
      racha.dias_consecutivos = 1;
      racha.ultima_actualizacion = hoy;
      await racha.save();
      return res.status(200).json({ mensaje: 'Racha reiniciada. ¡No te rindas!', datos: racha });
    } else {
      return res.status(400).json({ error: 'La fecha enviada no puede ser menor a la última actualización' });
    }

  } catch (error) {
    console.error('Error en actualizarRacha:', error);
    res.status(500).json({ error: 'Error interno al actualizar la racha' });
  }
};


const obtenerRachasUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const rachas = await HistorialRachas.find({ usuario_id: usuarioId });
    res.status(200).json(rachas);
  } catch (error) {
    console.error('Error en obtenerRachasUsuario:', error);
    res.status(500).json({ error: 'Error al obtener las rachas' });
  }
};

module.exports = {
  actualizarRacha,
  obtenerRachasUsuario
};
