'use strict';
require('dotenv').config();

async function listarModelos() {
  try {
    console.log('Buscando modelos de IA disponibles para tu cuenta...');
    
    // Hacemos una petición directa a Google
    const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await respuesta.json();
    
    if (data.models) {
      console.log('\n¡Éxito! Copia y pega uno de estos nombres en tu controlador:\n');
      
      // Filtramos solo los que sirven para generar texto
      data.models.forEach(modelo => {
        if (modelo.supportedGenerationMethods.includes('generateContent')) {
          // Limpiamos el texto para que te dé el nombre exacto
          console.log(`▶ ${modelo.name.replace('models/', '')}`);
        }
      });
      console.log('\n');
    } else {
      console.log('Hubo un problema leyendo la llave:', data);
    }
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

listarModelos();