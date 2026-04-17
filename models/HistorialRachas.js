'use strict';

const mongoose = require('mongoose');

const historialRachasSchema = new mongoose.Schema({
  usuario_id: {
    type: Number,
    required: true
  },
  habito: {
    type: String, // Ej: "Agua", "Sueño", "Ejercicio", "Bienestar"
    required: true
  },
  dias_consecutivos: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  ultima_actualizacion: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Candado: Solo 1 registro por usuario y por hábito
historialRachasSchema.index({ usuario_id: 1, habito: 1 }, { unique: true });

module.exports = mongoose.model('HistorialRachas', historialRachasSchema);
