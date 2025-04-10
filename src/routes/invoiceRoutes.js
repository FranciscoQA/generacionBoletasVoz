const express = require('express');
const { createInvoice, getInvoice } = require('../controllers/invoiceController');

const router = express.Router();
// Ruta para crear una boleta o factura
router.post('/create', createInvoice); // asegurate de que 

// Ruta para obtener una boleta o factura por ID
router.get('/:id', getInvoice);

module.exports = router;