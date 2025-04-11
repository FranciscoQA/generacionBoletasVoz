const {Invoice , Product, SUNATSync} = require('../models');
const sunatService = require('../services/sunatService');

// controlador para crear una factura
exports.createInvoice = async (req, res) => {
    const {rucOrDni, products } = req.body; // Extrae rucOrDni y productos del cuerpo de la solicitud
 
    try {

        //Validar que se envíe el campo rucOrDni
        if(!rucOrDni){
            return res.status(400).json({message :'El campo rucOrDni es obligatorio'});
        }

        // Validar que se envíen productos
        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'La factura debe contener al menos un producto.' });
        }
        //consultar datos del cliente desde sunat

        const clientData = await sunatService.getClientData(rucOrDni);
        if(!clientData){
            return res.status(404).json({message:'Cliente no encontrado en SUNAT'});
        }
 
        // Crear la factura
        const invoice = await Invoice.create({ 
            clientName: clientData.clientName || clientData.razonSocial,
            clientRucOrDni: rucOrDni,
            total:0,
         });
 
        let total = 0;
 
        // Asociar productos a la factura y calcular el total
        for (const productData of products) {
            const product = await Product.findByPk(productData.id);
 
            if (!product) {
                return res.status(404).json({ message: `Producto con ID ${productData.id} no encontrado.` });
            }
 
            const productTotal = product.price * productData.quantity;
            total += productTotal;
 
            // Asociar producto con la factura
            await invoice.addProduct(product, { through: { quantity: productData.quantity, total: productTotal } });
        }
 
        // Actualizar el total de la factura
        invoice.total = total;
        await invoice.save();

        //Crear registro en SUNATSync
        await SUNATSync.create({
            invoiceId:invoice.id,
            status:'pending'
        });
 
        res.status(201).json({ message: 'Factura creada exitosamente.', invoice });
    } catch (error) {
        console.error('Error al crear la factura:', error);
        res.status(500).json({ message: 'Error al crear la factura.', error });
    }
};

// Sincronizar factura con SUNAT
exports.syncInvoice = async (req,res) => {
    const{id} = req.params;
    try{
        const invoice = await Invoice.findByPk(id);

        if(!invoice){
            return res.status(400).json({ message: `Factura con ID ${id} no encontrada.` });
        }

        //Sincronizar con SUNAT
        const sunatResponse = await sunatService.syncInvoiceToSunat(invoice);

        // Actualizar estado en SUNATSync
    const syncRecord = await SUNATSync.findOne({ where: { invoiceId: id } });
    syncRecord.status = 'synced';
    syncRecord.sunatResponseCode = sunatResponse.code;
    syncRecord.sunatMessage = sunatResponse.message;
    syncRecord.syncDate = new Date();
    await syncRecord.save();
 
    res.status(200).json({ message: 'Factura sincronizada exitosamente con SUNAT.', sunatResponse });
  } catch (error) {
    console.error('Error al sincronizar con SUNAT:', error);
    res.status(500).json({ message: 'Error al sincronizar con SUNAT.', error });
  }
};


// Controlador para obtener una factura por ID
exports.getInvoice = async (req, res) => {
    const { id } = req.params;
 
    try {
        const invoice = await Invoice.findByPk(id, {
            include: { model: Product }, // Incluye los productos relacionados
        });
 
        if (!invoice) {
            return res.status(404).json({ message: `Factura con ID ${id} no encontrada.` });
        }
 
        res.status(200).json(invoice);
    } catch (error) {
        console.error('Error al obtener la factura:', error);
        res.status(500).json({ message: 'Error al obtener la factura.', error });
    }
};