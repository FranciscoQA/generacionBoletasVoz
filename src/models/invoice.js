const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require ('./product'); // importar el modelo Product para la relacion
let invoiceCounter = 0; // Contador simple para generar IDs
 
const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => {
            invoiceCounter++;
            return `INV-${String(invoiceCounter).padStart(4, '0')}`; // Genera IDs como INV-0001
        },
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    issuedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName:'Invoices',
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
});
 // relacion de muchos a muchos con productos
 Invoice.belongsToMany(Product,{through:'InvoiceProducts'});
module.exports = Invoice;