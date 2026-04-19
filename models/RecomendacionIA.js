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
    type: String, // Ej: "Desayuno", "Comida", "Cena"
    enum: ['Desayuno', 'Comida', 'Cena'],
    default: null
  },
  tipo_recomendacion: {
    type: String, // Ej: "mini-reto", "consejo", "alerta"
    required: true
  },
  mensaje_texto: {
    type: String, // El mensaje generado por la IA
    required: true
  },
  estado_completado: {
    type: Boolean,
    default: false // Todo reto nace sin completar
  }
}, {
  timestamps: true
});

// Índice para buscar rápido las recomendaciones de un usuario, de la más nueva a la más vieja
recomendacionIASchema.index({ usuario_id: 1, fecha_generacion: -1 });

module.exports = mongoose.model('RecomendacionIA', recomendacionIASchema);