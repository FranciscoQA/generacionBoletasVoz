const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
 
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
 
module.exports = InvoiceProducts;