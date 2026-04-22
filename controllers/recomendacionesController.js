'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const RecomendacionIA = require('../models/RecomendacionIA');
const RegistroBienestar = require('../models/RegistroBienestar');
const RegistroSueno = require('../models/RegistroSueno');
const RegistroAlimentacion = require('../models/RegistroAlimentacion');
const RegistroActividadFisica = require('../models/RegistroActividadFisica');
const pool = require('../config/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generarRecomendacionIA = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const [perfilDb] = await pool.query(
      `SELECT p.nombre, m.meta_agua_vasos
       FROM perfiles p
       LEFT JOIN metas_configuracion m ON p.usuario_id = m.usuario_id
       WHERE p.usuario_id = ?`,
      [usuarioId]
    );

    const nombreUsuario = perfilDb.length > 0 && perfilDb[0].nombre ? perfilDb[0].nombre : 'Usuario';
    const metaAgua = perfilDb.length > 0 && perfilDb[0].meta_agua_vasos ? perfilDb[0].meta_agua_vasos : 8;

    const inicioDia = new Date();
    inicioDia.setUTCHours(0, 0, 0, 0);
    const finDia = new Date();
    finDia.setUTCHours(23, 59, 59, 999);

    const recomendacionesExistentes = await RecomendacionIA.find({
      usuario_id: usuarioId,
      fecha_generacion: { $gte: inicioDia, $lte: finDia }
    });

    const momentosGenerados = recomendacionesExistentes.map(r => r.momento_dia.toLowerCase());

    const [bienestarHoy, suenoHoy, alimentacionesHoy, actividadHoy] = await Promise.all([
      RegistroBienestar.findOne({ usuario_id: usuarioId, fecha: { $gte: inicioDia, $lte: finDia } }).sort({ fecha: -1 }),
      RegistroSueno.findOne({ usuario_id: usuarioId, fecha: { $gte: inicioDia, $lte: finDia } }).sort({ fecha: -1 }),
      RegistroAlimentacion.find({ usuario_id: usuarioId, fecha: { $gte: inicioDia, $lte: finDia } }).sort({ hora_registro: 1 }),
      RegistroActividadFisica.findOne({ usuario_id: usuarioId, fecha: { $gte: inicioDia, $lte: finDia } }).sort({ fecha: -1 })
    ]);

    if (!bienestarHoy || !suenoHoy || alimentacionesHoy.length === 0 || !actividadHoy) {
      return res.status(400).json({
        registros_completos: false,
        error: 'Para darte un consejo exacto, necesito que completes tus 4 registros de hoy (Agua/Ánimo, Sueño, Nutrición y Ejercicio).'
      });
    }

    const comidasPorTipo = {
      Desayuno: alimentacionesHoy.find(c => c.tipo_comida?.toLowerCase().includes('desayuno')),
      Comida: alimentacionesHoy.find(c => c.tipo_comida?.toLowerCase().includes('comida') || c.tipo_comida?.toLowerCase().includes('almuerzo')),
      Cena: alimentacionesHoy.find(c => c.tipo_comida?.toLowerCase().includes('cena'))
    };

    const momentosDia = ['Desayuno', 'Comida', 'Cena'];
    const recomendacionesGuardadas = [...recomendacionesExistentes];

    for (const momento of momentosDia) {
      if (momentosGenerados.includes(momento.toLowerCase())) continue;

      const comidaMomento = comidasPorTipo[momento];

      if (!comidaMomento) continue;

      const prompt = `
        Eres el coach de bienestar oficial de la app prevIA.
        Tu usuario se llama ${nombreUsuario}.

        El usuario acaba de registrar su ${momento.toLowerCase()} de hoy.

        Análisis de este momento:
        - ${momento}: "${comidaMomento?.descripcion_corta || 'No especificado'}"
        - Contexto general: Estrés ${bienestarHoy.nivel_estres || 3}/5, Ánimo "${bienestarHoy.estado_animo || 'Normal'}", Agua: ${bienestarHoy.vasos_agua_consumidos || 0}/${metaAgua} vasos.
        - Sueño anoche: ${suenoHoy.horas_dormidas || 0} horas (Calidad: ${suenoHoy.calidad || 3}/5).
        - Actividad física: ${actividadHoy.duracion_minutos || 0} minutos de ${actividadHoy.tipo_ejercicio || 'ejercicio'}.

        Instrucciones:
        Dale un consejo específico para este ${momento.toLowerCase()} que considerando su estado general.
        - Si la comida es poco nutritiva, sugiere mejoras.
        - Si es buena opción, motívalo a mantenerlo.
        - Si puede complementar con algo (agua, proteína, etc.), recomiéndalo.

        Responde ESTRICTAMENTE en formato JSON válido, sin comillas invertidas ni la palabra json, con esta estructura:
        {
          "tipo": "Recomendación",
          "mensaje": "Consejo específico de máximo 2 oraciones para este ${momento}. Sin saludar."
        }
      `;

      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        let respuestaIA = result.response.text();

        respuestaIA = respuestaIA.replace(/```json/gi, '').replace(/```/g, '').trim();

        let tipoRecomendacion = 'Sugerencia';
        let mensajeRecomendacion = `Buen ${momento.toLowerCase()}.`;

        try {
          const dataProcesada = JSON.parse(respuestaIA);
          tipoRecomendacion = dataProcesada.tipo || 'Sugerencia';
          mensajeRecomendacion = dataProcesada.mensaje || respuestaIA;
        } catch (e) {
          mensajeRecomendacion = respuestaIA;
        }

        const nuevaRecomendacion = new RecomendacionIA({
          usuario_id: usuarioId,
          fecha_generacion: new Date(),
          momento_dia: momento,
          tipo_recomendacion: tipoRecomendacion,
          mensaje_texto: mensajeRecomendacion,
          estado_completado: false
        });

        const recomendacionGuardada = await nuevaRecomendacion.save();
        recomendacionesGuardadas.push(recomendacionGuardada);

      } catch (error) {
        console.error(`🚨 ERROR GENERANDO IA PARA ${momento}:`, error);
      }
    }

    res.status(201).json({
      registros_completos: true,
      mensaje: 'prevIA ha actualizado tus consejos del día',
      datos: recomendacionesGuardadas
    });

  } catch (error) {
    console.error("🚨 ERROR FATAL EN EL BACKEND:", error);
    res.status(500).json({ error: 'Error interno al conectar con la Inteligencia Artificial' });
  }
};

const obtenerRecomendacionesUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const recomendaciones = await RecomendacionIA.find({ usuario_id: usuarioId }).sort({ fecha_generacion: -1 });
    res.status(200).json(recomendaciones);
  } catch (error) {
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

    if (!recomendacionActualizada) {
      return res.status(404).json({ error: 'No encontrada' });
    }

    const inicioDia = new Date();
    inicioDia.setUTCHours(0, 0, 0, 0);
    const finDia = new Date();
    finDia.setUTCHours(23, 59, 59, 999);

    const retosCompletadosHoy = await RecomendacionIA.countDocuments({
      usuario_id: usuarioId,
      fecha_generacion: { $gte: inicioDia, $lte: finDia },
      estado_completado: true
    });

    let medallaGanada = null;

    if (retosCompletadosHoy === 3) {
      const [medallaExistente] = await pool.query(
        `SELECT id_medalla FROM usuario_medallas 
         WHERE usuario_id = ? 
         AND nombre_medalla = 'Día Perfecto' 
         AND DATE(fecha_obtenida) = CURDATE()`,
        [usuarioId]
      );

      if (medallaExistente.length === 0) {
        const nombreMedalla = 'Día Perfecto';
        const descripcionMedalla = 'Completaste todos tus consejos de prevIA (Desayuno, Comida y Cena) en un solo día.';
        const iconoUrl = '🌟'; 

        const query = `
          INSERT INTO usuario_medallas (usuario_id, nombre_medalla, descripcion_medalla, icono_url)
          VALUES (?, ?, ?, ?)
        `;
        await pool.query(query, [usuarioId, nombreMedalla, descripcionMedalla, iconoUrl]);

        medallaGanada = {
          nombre: nombreMedalla,
          descripcion: descripcionMedalla,
          icono: iconoUrl
        };
      }
    }

    res.status(200).json({ 
      mensaje: medallaGanada ? '¡Día Perfecto completado!' : '¡Reto completado!', 
      datos: recomendacionActualizada,
      medalla: medallaGanada
    });

  } catch (error) {
    console.error("🚨 ERROR AL COMPLETAR RETO O DAR MEDALLA:", error);
    res.status(500).json({ error: 'Error al actualizar tu progreso' });
  }
};

module.exports = {
  generarRecomendacionIA,
  obtenerRecomendacionesUsuario,
  completarRecomendacion
};