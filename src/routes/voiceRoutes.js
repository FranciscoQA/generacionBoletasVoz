const express = require('express');
const { processVoiceCommand, uploadMiddleware } = require('../controllers/voiceController'); // Importa las funciones del controlador
 
const router = express.Router();
 
// Ruta para procesar comandos de voz
router.post('/process', uploadMiddleware, processVoiceCommand);
 
module.exports = router;