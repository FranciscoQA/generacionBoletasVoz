const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
 
// Cargar las variables de entorno desde el archivo .env
dotenv.config();
 
// Verifica que las variables se están cargando correctamente
console.log('Configuración de base de datos:', {
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
});
 
// Inicializar Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false, // Opcional: desactiva los logs SQL
});
 
sequelize.authenticate()
    .then(() => console.log('Conexión a la base de datos establecida exitosamente.'))
    .catch((err) => console.error('Error al conectar a la base de datos:', err));
 
module.exports = sequelize;