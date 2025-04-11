const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// let productCounter = 0;
 
const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        // defaultValue: () => {
        //     productCounter++;
        //     return `P${String(productCounter).padStart(3, '0')}`; // Genera IDs como P001
        // },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName:'Products',
    timestamps: true,
});

// //Sincronizar el contador con el maximo ID existente en la base de datos
// Product.beforeCreate( async ()=>{
//     if(productCounter ===0){ // solo sincroniza si el contador no se ha inicializado
//     const maxId = await Product.max('id'); // obtiene el ID mas alto
//     if(maxId){
//         const numericPart= parseInt(maxId.replace('P',''),10); // extraer la parte nuymero del ID
//         productCounter =numericPart+1;//Actualiza el contador 
//     }
// }
// });
// Hook antes de crear
Product.beforeCreate(async (product) => {
    const maxId = await Product.max('id'); // P004
    let nextNumber = 1;
  
    if (maxId) {
      const numericPart = parseInt(maxId.replace('P', ''), 10); // 4
      nextNumber = numericPart + 1; // 5
    }
  
    product.id = `P${String(nextNumber).padStart(3, '0')}`; // P005
  });
module.exports = Product;