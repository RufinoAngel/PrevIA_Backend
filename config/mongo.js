// Archivo: config/mongo.js
'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const connectMongo = async () => {
  try {
    // Aquí usamos la variable de entorno, o una ruta local por defecto
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/previa_nosql';
    
    await mongoose.connect(uri);
    console.log('Conexión a MongoDB establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    // Si la base de datos de los registros diarios falla, el backend debe detenerse
    process.exit(1);
  }
};

module.exports = connectMongo;