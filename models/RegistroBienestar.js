'use strict';

const mongoose = require('mongoose');

const registroBienestarSchema = new mongoose.Schema({
  usuario_id: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  vasos_agua_consumidos: {
    type: Number,
    required: true,
    min: 0
  },
  estado_animo: {
    type: String,
    required: true
  },
  nivel_estres: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true // Esto agrega automáticamente la fecha de creación y actualización
});

// Este es el candado lógico que replica el que creamos en Atlas:
// Bloquea que el mismo usuario guarde dos registros el mismo día.
registroBienestarSchema.index({ usuario_id: 1, fecha: 1 }, { unique: true });

module.exports = mongoose.model('RegistroBienestar', registroBienestarSchema);