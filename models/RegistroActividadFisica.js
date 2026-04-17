'use strict';

const mongoose = require('mongoose');

const registroActividadFisicaSchema = new mongoose.Schema({
  usuario_id: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  tipo_ejercicio: {
    type: String, // Ej: "Caminata", "Pesas", "Natación"
    required: true
  },
  duracion_minutos: {
    type: Number, // Métrica principal para evaluar el cumplimiento de metas
    required: true,
    min: 1
  },
  intensidad: {
    type: String, // Ej: "Baja", "Media", "Alta"
    required: true
  }
}, {
  timestamps: true
});

// Índice para acelerar las búsquedas por usuario y fecha, permitiendo múltiples registros al día
registroActividadFisicaSchema.index({ usuario_id: 1, fecha: 1 });

module.exports = mongoose.model('RegistroActividadFisica', registroActividadFisicaSchema);
