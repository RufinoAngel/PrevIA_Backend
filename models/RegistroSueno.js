'use strict';

const mongoose = require('mongoose');

const registroSuenoSchema = new mongoose.Schema({
  usuario_id: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  horas_dormidas: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  calidad: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  hora_acostarse: {
    type: String, // Formato "HH:mm"
    required: true
  },
  hora_despertar: {
    type: String, // Formato "HH:mm"
    required: true
  }
}, {
  timestamps: true
});

// Candado: Un registro de sueño principal por usuario al día
registroSuenoSchema.index({ usuario_id: 1, fecha: 1 }, { unique: true });

module.exports = mongoose.model('RegistroSueno', registroSuenoSchema);
