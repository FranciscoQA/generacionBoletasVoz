const app = require('./app');
const dotenv = require('dotenv');
 
// Configurar variables de entorno
dotenv.config();
 
const PORT = process.env.PORT || 3000;
 
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});