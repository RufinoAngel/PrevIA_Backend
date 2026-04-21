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
    type: String, 
    required: true
  },
  duracion_minutos: {
    type: Number, 
    required: true,
    min: 1
  },
  intensidad: {
    type: String, 
    required: true
  }
}, {
  timestamps: true
});


registroActividadFisicaSchema.index({ usuario_id: 1, fecha: 1 });

module.exports = mongoose.model('RegistroActividadFisica', registroActividadFisicaSchema);
