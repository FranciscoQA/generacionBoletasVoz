const axios = require('axios');
 
const analyzeText = async (text) => {
    try {
        // Enviar texto al servicio Flask
        const response = await axios.post('http://localhost:5000/analyze', { text });
        return response.data.entities; // Retornar las entidades encontradas por spaCy
    } catch (error) {
        console.error('Error al analizar texto con Flask:', error.message);
        throw new Error('No se pudo analizar el texto con NLP.');
    }
};
 
module.exports = { analyzeText };