'use strict';

const mongoose = require('mongoose');

const recomendacionIASchema = new mongoose.Schema({
  usuario_id: {
    type: Number,
    required: true
  },
  fecha_generacion: {
    type: Date,
    required: true
  },
  momento_dia: {
    type: String, 
    enum: ['Desayuno', 'Comida', 'Cena'],
    default: null
  },
  tipo_recomendacion: {
    type: String, 
    required: true
  },
  mensaje_texto: {
    type: String, 
    required: true
  },
  estado_completado: {
    type: Boolean,
    default: false 
  }
}, {
  timestamps: true
});


recomendacionIASchema.index({ usuario_id: 1, fecha_generacion: -1 });

module.exports = mongoose.model('RecomendacionIA', recomendacionIASchema);
