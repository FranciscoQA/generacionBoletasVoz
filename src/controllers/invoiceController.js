const { Invoice, Product, SUNATSync } = require('../models');
const sunatService = require('../services/sunatService');


// GENERAR ID UNICO PARA LA FACTURA O BOLETA
const generateNextInvoiceId = async () => {
    const lastInvoice = await Invoice.findOne({
        order: [['createdAt', 'DESC']]
    });

    if (!lastInvoice) {
        return 'INV-0001';
    }

    const lastId = lastInvoice.id; // Ej: 'INV-0002'
    const lastNum = parseInt(lastId.split('-')[1], 10); // 2
    const nextNum = lastNum + 1;

    return `INV-${String(nextNum).padStart(4, '0')}`; // 'INV-0003'
};

// controlador para crear una factura O BOLETA
exports.createInvoice = async (req, res) => {
    const { rucOrDni, products } = req.body; // Extrae rucOrDni y productos del cuerpo de la solicitud

    try {

        //Validar que se envíe el campo rucOrDni
        if (!rucOrDni) {
            return res.status(400).json({ message: 'El campo rucOrDni es obligatorio' });
        }

        // Validar que se envíen productos
        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'La factura debe contener al menos un producto.' });
        }

        //consultar datos del cliente desde sunat O RENIEC

        const clientData = await sunatService.getClientData(rucOrDni);
        console.log('Datos de cliente', clientData);

        if (!clientData) {
            return res.status(404).json({ message: 'Cliente no encontrado en SUNAT o RENIEC' });
        }
        // Validar que se pueda obtener un nombre
        const clientName =
            clientData.clientName ||
            clientData.razonSocial ||
            clientData.nombres;
            
            if (!clientName) {
                return res.status(400).json({
                  message: 'No se pudo determinar el nombre del cliente.',
                  detalle: clientData
                });
              }
          
        //GENERAR ID UNICO PARA LA FACTURA
        const invoiceId = await generateNextInvoiceId();

        // Crear la factura
        const invoice = await Invoice.create({
            id: invoiceId, // usamos el ID generado
            clientName,
            clientRucOrDni: rucOrDni,
            total: 0,
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
            await invoice.addProduct(product, { 
                through: { quantity: productData.quantity, total: productTotal } 
            });
        }

        // Actualizar el total de la factura
        invoice.total = total;
        await invoice.save();

        //Crear registro en tabla SUNATSync
        await SUNATSync.create({
            invoiceId: invoice.id,
            status: 'pending'
        });

        res.status(201).json({ message: 'Factura creada exitosamente.', invoice });
    } catch (error) {
        console.error('Error al crear la factura:', error);
        res.status(500).json({ message: 'Error al crear la factura.', error });
    }
};




// Obtener una factura con detalle 
exports.getInvoice = async (req, res) => {
    const { id } = req.params;

    try {
        const invoice = await Invoice.findByPk(id, {
            include: {
                model: Product,
                attributes: ['id', 'name', 'price'],
                through: {
                    attributes: ['quantity', 'total']
                }
            }, // Incluye los productos relacionados
        });

        if (!invoice) {
            return res.status(404).json({ message: `Factura con ID ${id} no encontrada.` });
        }

        // Formatear los productos
        const formattedProducts = invoice.Products.map(product => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            quantity: product.InvoiceProducts.quantity,
            subtotal: parseFloat(product.InvoiceProducts.total)
        }));

        res.status(200).json(invoice);
    } catch (error) {
        console.error('Error al obtener la factura:', error);
        res.status(500).json({ message: 'Error al obtener la factura.', error });
    }
};

// Sincronizar factura con SUNAT
exports.syncInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const invoice = await Invoice.findByPk(id);

        if (!invoice) {
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