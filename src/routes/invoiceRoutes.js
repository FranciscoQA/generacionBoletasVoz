const express = require('express');
const { createInvoice, getInvoice ,syncInvoice} = require('../controllers/invoiceController');
const { InvoiceProducts } = require('../models');
const voiceController = require('../controllers/voiceController'); //Nuevo controlador

const router = express.Router();
// Ruta para crear una boleta o factura
router.post('/create', createInvoice); // asegurate de que 

// Ruta para obtener una boletaS o facturaS por ID
router.get('/:id', getInvoice);

//RUta para obtener boleta o factura detallada  consultar factura o boleta 
router.get('/details/:id',getInvoice);

//Ruta para manejar comandos de voz
router.post ('/voice-command',voiceController.processVoiceCommand);

router.post('/:id/sync',syncInvoice); // Nueva ruta para sincronizar con SUNAT

module.exports = router;