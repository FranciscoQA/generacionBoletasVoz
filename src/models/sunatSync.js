const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Invoice = require('./invoice');
 
const SUNATSync = sequelize.define('SUNATSync', {
  invoiceId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Invoice,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'synced', 'rejected'),
    defaultValue: 'pending',
  },
  sunatResponseCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sunatMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  syncDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'SUNATSync',
  timestamps: true,
});
 
module.exports = SUNATSync;