const {Invoice , Product} = require('../models');
 
// controlador para crear una factura
exports.createInvoice = async (req, res) => {
    const { products } = req.body; // Lista de productos con sus cantidades
 
    try {
        // Validar que se envíen productos
        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'La factura debe contener al menos un producto.' });
        }
 
        // Crear la factura
        const invoice = await Invoice.create({ total: 0 });
 
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
 
        res.status(201).json({ message: 'Factura creada exitosamente.', invoice });
    } catch (error) {
        console.error('Error al crear la factura:', error);
        res.status(500).json({ message: 'Error al crear la factura.', error });
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