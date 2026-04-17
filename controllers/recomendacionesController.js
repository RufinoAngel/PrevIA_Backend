'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const RecomendacionIA = require('../models/RecomendacionIA');
const RegistroBienestar = require('../models/RegistroBienestar');
const RegistroSueno = require('../models/RegistroSueno'); 
const RegistroAlimentacion = require('../models/RegistroAlimentacion');
const RegistroActividadFisica = require('../models/RegistroActividadFisica');
const pool = require('../config/db'); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. GENERAR UNA RECOMENDACIÓN CON INTELIGENCIA ARTIFICIAL
// 1. GENERAR UNA RECOMENDACIÓN CON INTELIGENCIA ARTIFICIAL
const generarRecomendacionIA = async (req, res) => {
  try {
    console.log('👉 ¡HOLA! El frontend sí me llamó para generar la IA');
    const usuarioId = req.usuario.id;

    // A. Consultar MySQL: Obtener el nombre y metas
    const [perfilDb] = await pool.query(
      `SELECT p.nombre, m.meta_agua_vasos 
       FROM perfiles p 
       LEFT JOIN metas_configuracion m ON p.usuario_id = m.usuario_id 
       WHERE p.usuario_id = ?`,
      [usuarioId]
    );

    const nombreUsuario = perfilDb.length > 0 && perfilDb[0].nombre ? perfilDb[0].nombre : 'Usuario';
    const metaAgua = perfilDb.length > 0 && perfilDb[0].meta_agua_vasos ? perfilDb[0].meta_agua_vasos : 8;

    // B. Definir los límites del día de HOY (¡EN HORA LOCAL, NO UTC!)
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0); // Cambiamos setUTCHours por setHours
    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999); // Cambiamos setUTCHours por setHours
    
    // CACHÉ DEL BACKEND: ¿Ya le dimos consejo hoy a este usuario?
    const recomendacionExistente = await RecomendacionIA.findOne({
      usuario_id: usuarioId,
      fecha_generacion: { $gte: inicioDia, $lte: finDia }
    });

    if (recomendacionExistente) {
      return res.status(200).json({ datos: recomendacionExistente });
    }

    // C. EL GUARDIA DE SEGURIDAD
    const [bienestarHoy, suenoHoy, alimentacionHoy, actividadHoy] = await Promise.all([
      RegistroBienestar.findOne({ usuario_id: usuarioId, fecha: { $gte: inicioDia, $lte: finDia } }).sort({ fecha: -1 }),
      RegistroSueno.findOne({ usuario_id: usuarioId, fecha: { $gte: inicioDia, $lte: finDia } }).sort({ fecha: -1 }),
      RegistroAlimentacion.findOne({ usuario_id: usuarioId, fecha: { $gte: inicioDia, $lte: finDia } }).sort({ fecha: -1 }),
      RegistroActividadFisica.findOne({ usuario_id: usuarioId, fecha: { $gte: inicioDia, $lte: finDia } }).sort({ fecha: -1 })
    ]);

    // 🔥 EL CHISMOSO: Esto imprimirá en tu terminal qué registros SÍ encontró y cuáles NO
    console.log(`[IA DEBUG] Registros encontrados -> Bienestar: ${!!bienestarHoy} | Sueño: ${!!suenoHoy} | Nutrición: ${!!alimentacionHoy} | Actividad: ${!!actividadHoy}`);

    // Si falta AUNQUE SEA UNO, bloqueamos a la IA y le avisamos al Frontend
    if (!bienestarHoy || !suenoHoy || !alimentacionHoy || !actividadHoy) {
      return res.status(400).json({ 
        registros_completos: false,
        error: 'Para darte un consejo exacto, necesito que completes tus 4 registros de hoy (Agua/Ánimo, Sueño, Nutrición y Ejercicio).' 
      });
    }

    // D. Armar el Súper-Prompt
    const prompt = `
      Eres el coach de bienestar oficial de la app PrevIA.
      Tu usuario se llama ${nombreUsuario}.
      
      Análisis de su día de hoy:
      - Bienestar: Estrés ${bienestarHoy.nivel_estres || 3}/5, Ánimo "${bienestarHoy.estado_animo || 'Normal'}", Agua: ${bienestarHoy.vasos_agua_consumidos || 0}/${metaAgua} vasos.
      - Sueño: Durmió ${suenoHoy.horas_dormidas || 0} horas (Calidad reportada: ${suenoHoy.calidad || 3}/5).
      - Nutrición: Comió "${alimentacionHoy.descripcion_corta || 'No especificado'}".
      - Actividad Física: Hizo ${actividadHoy.duracion_minutos || 0} minutos de ${actividadHoy.tipo_ejercicio || 'ejercicio'} a intensidad ${actividadHoy.intensidad || 'Media'}.
      
      Instrucciones:
      Con base en estos datos, decide qué necesita más el usuario hoy.
      - Si está descuidando un área, dale una "Recomendación" específica para corregirlo.
      - Si va bien pero puede mejorar, dale una "Sugerencia".
      - Si todo está excelente, dale un "Reto" extra para motivarlo.
      
      Responde ESTRICTAMENTE en formato JSON válido, sin usar comillas invertidas extra ni la palabra json, con la siguiente estructura exacta:
      {
        "tipo": "Recomendación",
        "mensaje": "El mensaje directo de máximo 3 oraciones. Sin saludar."
      }
    `;

    // E. Llamar a Gemini
    console.log('[IA DEBUG] Llamando a Gemini API...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    let respuestaIA = result.response.text();
    console.log('[IA DEBUG] Respuesta cruda de Gemini:', respuestaIA);

    respuestaIA = respuestaIA.replace(/```json/gi, '').replace(/```/g, '').trim();

    let tipoRecomendacion = 'Sugerencia';
    let mensajeRecomendacion = 'Continúa con tus buenos hábitos.';

    try {
      const dataProcesada = JSON.parse(respuestaIA);
      tipoRecomendacion = dataProcesada.tipo || 'Sugerencia';
      mensajeRecomendacion = dataProcesada.mensaje || respuestaIA;
    } catch (e) {
      console.warn('Gemini no devolvió un JSON estricto. Se usará el texto plano.');
      mensajeRecomendacion = respuestaIA;
    }

    // F. Guardar la creación en MongoDB
    const nuevaRecomendacion = new RecomendacionIA({
      usuario_id: usuarioId,
      fecha_generacion: new Date(),
      tipo_recomendacion: tipoRecomendacion, 
      mensaje_texto: mensajeRecomendacion,
      estado_completado: false
    });

    const recomendacionGuardada = await nuevaRecomendacion.save();

    res.status(201).json({
      registros_completos: true,
      mensaje: 'PrevIA ha analizado tu día y tiene algo para ti',
      datos: recomendacionGuardada
    });

  } catch (error) {
    console.error('Error en generarRecomendacionIA:', error);
    res.status(500).json({ error: 'Error interno al conectar con la Inteligencia Artificial' });
  }
};

const obtenerRecomendacionesUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const recomendaciones = await RecomendacionIA.find({ usuario_id: usuarioId }).sort({ fecha_generacion: -1 });
    res.status(200).json(recomendaciones);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener recomendaciones' });
  }
};

const completarRecomendacion = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;
    const recomendacionActualizada = await RecomendacionIA.findOneAndUpdate(
      { _id: id, usuario_id: usuarioId },
      { estado_completado: true },
      { returnDocument: 'after' }
    );
    if (!recomendacionActualizada) return res.status(404).json({ error: 'No encontrada' });
    res.status(200).json({ mensaje: '¡Reto completado!', datos: recomendacionActualizada });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

module.exports = {
  generarRecomendacionIA,
  obtenerRecomendacionesUsuario,
  completarRecomendacion
};