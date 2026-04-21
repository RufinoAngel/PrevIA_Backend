'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const mysqlPool = require('./config/db');
const connectMongo = require('./config/mongo');
const userRoutes = require('./routes/userRoutes');
const bienestarRoutes = require('./routes/bienestarRoutes');
const suenoRoutes = require('./routes/suenoRoutes');
const alimentacionRoutes = require('./routes/alimentacionRoutes');
const actividadFisicaRoutes = require('./routes/actividadFisicaRoutes');
const rachasRoutes = require('./routes/rachasRoutes');
const recomendacionesRoutes = require('./routes/recomendacionesRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const medallasRoutes = require('./routes/medallasRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PrevIA Backend API',
    version: '1.0.0',
    description: 'Documentación oficial de la API para el Backend de PrevIA',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Servidor de Desarrollo',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/usuarios', userRoutes);
app.use('/api/bienestar', bienestarRoutes);
app.use('/api/sueno', suenoRoutes);
app.use('/api/alimentacion', alimentacionRoutes);
app.use('/api/actividad', actividadFisicaRoutes);
app.use('/api/rachas', rachasRoutes);
app.use('/api/recomendaciones', recomendacionesRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/medallas', medallasRoutes);
app.use('/api/admin', adminRoutes);

connectMongo();
mysqlPool.getConnection()
  .then((connection) => {
    console.log('Conexión a MySQL (puerto 3307) establecida correctamente.');
    connection.release(); 
  })
  .catch((error) => {
    console.error('Error al conectar con MySQL:', error);
  });

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Arquitectura híbrida de PrevIA en línea'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Documentación interactiva disponible en http://localhost:${PORT}/api-docs`);
});