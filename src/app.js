
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
const sunatSyncRoutes = require('./routes/sunatSyncRoutes');

app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sunat-sync', sunatSyncRoutes);


const { sequelize } = require('./models');
sequelize.sync(); //asegurate de que esto se ejeute

module.exports = app;