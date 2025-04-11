const express = require('express');
const { createInvoice, getInvoice ,syncInvoice} = require('../controllers/invoiceController');

const router = express.Router();
// Ruta para crear una boleta o factura
router.post('/create', createInvoice); // asegurate de que 

// Ruta para obtener una boleta o factura por ID
router.get('/:id', getInvoice);

router.post('/:id/sync',syncInvoice); // Nueva ruta para sincronizar con SUNAT

module.exports = router;