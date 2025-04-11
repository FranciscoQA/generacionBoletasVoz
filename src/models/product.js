const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = Product;