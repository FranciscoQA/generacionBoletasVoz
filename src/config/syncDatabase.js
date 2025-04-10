const sequelize = require('./database');
const Product = require('../models/product');
const Invoice = require('../models/invoice');
 
const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Esto borra y recrea las tablas cada vez (solo para desarrollo)
        console.log('Tablas sincronizadas con la base de datos.');
    } catch (err) {
        console.error('Error al sincronizar las tablas:', err);
    }
};
 
syncDatabase();