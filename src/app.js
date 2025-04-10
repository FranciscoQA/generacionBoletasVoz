const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
const invoiceRoutes = require('./routes/invoiceRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);

module.exports = app;