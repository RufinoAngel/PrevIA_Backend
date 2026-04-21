'use strict';

const mongoose = require('mongoose');

const registroAlimentacionSchema = new mongoose.Schema({
  usuario_id: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  tipo_comida: {
    type: String, 
    required: true
  },
  descripcion_corta: {
    type: [String], 
    required: true
  },
  hora_registro: {
    type: String, 
    required: true
  }
}, {
  timestamps: true
});


registroAlimentacionSchema.index({ usuario_id: 1, fecha: 1 });

module.exports = mongoose.model('RegistroAlimentacion', registroAlimentacionSchema);
