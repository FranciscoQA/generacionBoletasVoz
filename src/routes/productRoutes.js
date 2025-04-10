const express = require('express');
const { createProduct, getProducts } = require('../controllers/productController');

const router = express.Router();
// Crear un producto 
router.post('/create', createProduct);
 
// Obtener todos los productos po ID
router.get('/:id', getProducts);
 
module.exports = router;