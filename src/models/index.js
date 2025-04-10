const sequelize = require('../config/database');
const Invoice = requiere('./invoice');
const Product = requiere('./product');

// Relación de muchos a muchos
Invoice.belongsToMany(Product, { through: 'InvoiceProducts' });
Product.belongsToMany(Invoice, { through: 'InvoiceProducts' });
 
module.exports = { Invoice, Product };