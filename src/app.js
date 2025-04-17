
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path =require ('path');

const app = express();

// Configuración de multer para manejar archivos de audio
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los audios
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Middlewares
app.use(express.json());
app.use(cors());


// Rutas
const invoiceRoutes = require('./routes/invoiceRoutes');
const productRoutes = require('./routes/productRoutes');
const sunatSyncRoutes = require('./routes/sunatSyncRoutes');
const voicesRoutes = require('./routes/voiceRoutes');

app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sunat-sync', sunatSyncRoutes);
app.use('/api/invoices/details/',invoiceRoutes);
app.use('/api/voice-command',upload.single('audio')); // Agregar middlewarte para la ruta especifica
app.use('/api/voice',voicesRoutes);


const { sequelize } = require('./models');

sequelize.sync(); //asegurate de que esto se ejeute

module.exports = app;