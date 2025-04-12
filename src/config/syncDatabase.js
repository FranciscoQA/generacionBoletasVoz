
const {sequelize, Invoice, Product, InvoiceProducts } =require('../models');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Esto borra y recrea las tablas cada vez (solo para desarrollo)
        console.log('Tablas sincronizadas con la base de datos.');
        const [results] = await sequelize.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`);
        console.log('Tablas existentes:', results);
    } catch (err) {
        console.error('Error al sincronizar las tablas:', err);
    }
};


syncDatabase();
