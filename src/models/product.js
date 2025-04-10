const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Invoice = require('./invoice'); // Asegurate de importar el modelo Invoce
let productCounter = 0;
 
const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => {
            productCounter++;
            return `P${String(productCounter).padStart(3, '0')}`; // Genera IDs como P001
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName:'Products',
    timestamps: true,
});
 
// Relación de muchos a muchos entre facturas 
Product.belongsToMany(Invoice, { through: 'InvoiceProducts' });
 
module.exports = Product;