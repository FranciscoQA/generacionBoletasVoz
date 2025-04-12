const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


let invoiceCounter = 0; // Contador simple para generar IDs
 
const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        // defaultValue: () => {
        //     invoiceCounter++;
        //     return `INV-${String(invoiceCounter).padStart(4, '0')}`; // Genera IDs como INV-0001
        // },
    },
    clientName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientRucOrDni: {
        type: DataTypes.STRING,
        allowNull: false,
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

module.exports = Invoice;