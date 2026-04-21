'use strict';
require('dotenv').config();

async function listarModelos() {
  try {
    console.log('Buscando modelos de IA disponibles para tu cuenta...');
    
    
    const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`);
    const data = await respuesta.json();
    
    if (data.models) {
      console.log('\n¡Éxito! Copia y pega uno de estos nombres en tu controlador:\n');
      
      
      data.models.forEach(modelo => {
        if (modelo.supportedGenerationMethods.includes('generateContent')) {
          
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
