const Product = require('../models/product');
 
// Crear un nuevo producto
exports.createProduct = async (req, res) => {

if(!req.body){
    return res.status(400).json({message:'No se enviaron datos en el cuerpo del request'});
}

    console.log('Datos recibidos en req.body:',req.body);
    const { name, quantity, price } = req.body;
 
    if(!name || !quantity || !price){
        return res.status(400).json({message:'Todos los campos son obligatorios'});
    }
    try {
        const product = await Product.create({ name, quantity, price });
        res.status(201).json(product);
    } catch (error) {
        console.error('Error al crear el producto:',error)
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
};
 
// Obtener todos los productos
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
};