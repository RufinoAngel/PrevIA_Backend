'use strict';

const RegistroBienestar = require('../models/RegistroBienestar');

// 1. CREAR O ACTUALIZAR REGISTRO DIARIO (PATRÓN UPSERT)
const crearRegistroBienestar = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { fecha, vasosAgua, estadoAnimo, nivelEstres } = req.body;

    if (!fecha || vasosAgua === undefined || !estadoAnimo || !nivelEstres) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setUTCHours(0, 0, 0, 0);

    // LÓGICA UPSERT: Busca el registro de hoy. Si existe, lo actualiza; si no, lo crea.
    const registroGuardado = await RegistroBienestar.findOneAndUpdate(
      { 
        usuario_id: usuarioId, 
        fecha: fechaNormalizada 
      }, // 1. Criterio de búsqueda (Usuario y Fecha de hoy)
      { 
        $set: {
          vasos_agua_consumidos: vasosAgua,
          estado_animo: estadoAnimo,
          nivel_estres: nivelEstres
        }
      }, // 2. Datos a actualizar/insertar
      { 
        new: true,             // Devuelve el documento ya actualizado
        upsert: true,          // ¡LA MAGIA! Si no existe, lo crea.
        setDefaultsOnInsert: true, // Si lo crea, respeta los valores por defecto del modelo
        runValidators: true    // Valida que el estrés/ánimo cumplan las reglas del modelo
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

// 2. OBTENER HISTORIAL DEL USUARIO (Para la gráfica de la app)
const obtenerHistorialUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    
    // Busca solo los registros de este usuario, ordenados por fecha descendente
    const historial = await RegistroBienestar.find({ usuario_id: usuarioId })
      .sort({ fecha: -1 });

    res.status(200).json(historial);
  } catch (error) {
    console.error('Error en obtenerHistorialUsuario:', error);
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
};

// 3. OBTENER EL REGISTRO DE UN DÍA ESPECÍFICO (Ej: para cargar los datos de hoy al abrir la app)
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

// 4. ACTUALIZAR REGISTRO POR ID (Por si necesitas editar un día pasado específico)
const actualizarRegistroBienestar = async (req, res) => {
  try {
    const { id } = req.params;
    const { vasosAgua, estadoAnimo, nivelEstres } = req.body;
    const usuarioId = req.usuario.id;

    // Se busca por el ID del documento de Mongo y se asegura que pertenezca al usuario del Token
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