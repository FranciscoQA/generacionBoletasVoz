const fs = require('fs');
const { transcribeAudio } = require('../services/voiceService');
const invoiceController = require('./invoiceController');
const {analyzeText} =require('../services/nlpService'); // servicio para enviar texto al modelo NLP
const {validateProductsFromDatabase} = require('../services/databaseService');// Servicio para validar productos
 

//Controlador principal para procesar comandos de voz
exports.processVoiceCommand = async (req, res) => {
    const audioFile = req.file; // Archivo de audio enviado por el cliente
    if (!audioFile) {
        return res.status(400).json({ message: 'No se envió ningún archivo de audio.' });
    }
 
    try {
        // Leer el archivo de audio
        const audioBuffer = fs.readFileSync(audioFile.path);
 
        // Transcribir el audio
        const transcription = await transcribeAudio(audioBuffer);
        console.log('Texto transcrito:', transcription);
 
        // Usar el servicio NLP para analizar la transcripcion
        const entities =await analyzeText(transcription);
        console.log('Entidades extraídas por NLP: ',entities);

        //Validar y mapear entidades extraídas
        const { products, clientInfo } = await paseEntities(entities);


        // Llamar al controlador para crear la factura
        req.body = { rucOrDni: clientInfo, products };
        await invoiceController.createInvoice(req, res);
    } catch (error) {
        console.error('Error al procesar el comando de voz:', error.message);
        res.status(500).json({ message: 'Error al procesar el comando de voz.', error: error.message });
    }
};
 
// Función para validar y mapear las entidades extraídas por NLP
const parseEntities = async (entities) => {
    const products = [];
    let clientInfo = '';
 
    try {
        // Separar entidades por tipo
        for (const entity of entities) {
            if (entity.label === 'RUC' || entity.label === 'DNI') {
                clientInfo = entity.text;
            } else if (entity.label === 'PRODUCT') {
                const productName = entity.text.toLowerCase();
                const quantity = parseInt(entity.quantity, 10) || 1; // Si no hay cantidad, asumir 1
 
                // Validar producto desde la base de datos
                const isValid = await validateProductsFromDatabase(productName);
                if (!isValid) {
                    throw new Error(`Producto no reconocido: "${productName}".`);
                }
 
                // Agregar producto a la lista
                products.push({ name: productName, quantity });
            }
        }
 
        // Validar que al menos un producto esté presente
        if (products.length === 0) {
            throw new Error('No se detectaron productos válidos en el comando de voz.');
        }
 
        // Validar que el cliente tenga RUC o DNI
        if (!clientInfo) {
            throw new Error('No se detectó un RUC o DNI válido en el comando de voz.');
        }
 
        return { products, clientInfo };
    } catch (error) {
        console.error('Error al procesar entidades:', error.message);
        throw error;
    }
};