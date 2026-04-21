// Archivo: config/mongo.js
'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const connectMongo = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/previa_nosql';
    
    await mongoose.connect(uri);
    console.log('Conexión a MongoDB establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectMongo;