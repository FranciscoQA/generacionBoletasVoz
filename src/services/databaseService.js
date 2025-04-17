const sequelize = require('../config/database');
const { Product } = require('../models'); // Asume que tienes un modelo llamado Product
 
// Función para validar si un producto existe en la base de datos
const validateProductsFromDatabase = async (productName) => {
    try {
        // Consulta la tabla Products usando el modelo de Sequelize
        const product = await Product.findOne({ where: { name: productName.toLowerCase() } });
        return !!product; // Devuelve true si el producto existe
    } catch (error) {
        console.error('Error al validar producto en la base de datos:', error.message);
        throw new Error('No se pudo validar el producto en la base de datos.');
    }
};
 
module.exports = { validateProductsFromDatabase };