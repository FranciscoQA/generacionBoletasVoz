const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./product');
const Invoice = require('./invoice');
 
const InvoiceProducts = sequelize.define('InvoiceProducts', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'InvoiceProducts',
});
 Invoice.belongsToMany(Product,{through: InvoiceProducts});
 Product.belongsToMany(Invoice,{through: InvoiceProducts});
module.exports = InvoiceProducts;