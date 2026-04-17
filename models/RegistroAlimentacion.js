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
    type: String, // Ej: "Desayuno", "Comida Fuerte", "Cena", "Snack"
    required: true
  },
  descripcion_corta: {
    type: [String], // Arreglo para listar los alimentos de forma objetiva y sencilla
    required: true
  },
  hora_registro: {
    type: String, // Formato "HH:mm"
    required: true
  }
}, {
  timestamps: true
});

// Índice normal (SIN candado único) solo para que las búsquedas por fecha sean ultrarrápidas
registroAlimentacionSchema.index({ usuario_id: 1, fecha: 1 });

module.exports = mongoose.model('RegistroAlimentacion', registroAlimentacionSchema);
