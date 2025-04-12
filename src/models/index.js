const sequelize = require('../config/database');
const Product = require('./product');
const Invoice = require('./invoice');
const SUNATSync = require('./sunatSync');
const InvoiceProducts = require('./invoiceProducts');

// Relación de muchos a muchos
Invoice.belongsToMany(Product, { through: 'InvoiceProducts' });
Product.belongsToMany(Invoice, { through: 'InvoiceProducts' });
 

module.exports = { sequelize,Invoice, Product,InvoiceProducts,SUNATSync };