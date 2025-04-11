const axios = require('axios');
 
const getClientData = async (rucOrDni) => {
  try {
    const response = await axios.get(`${process.env.SUNAT_API_URL}/consulta/${rucOrDni}`, {
      headers: { 'Authorization': `Bearer ${process.env.SUNAT_API_KEY}` },
    });
 
    if (response.status === 200) {
      return response.data; // Datos del cliente desde SUNAT
    }
 
    return null;
  } catch (error) {
    console.error('Error al consultar SUNAT:', error.message);
    return null;
  }
};
 
const syncInvoiceToSunat = async (invoiceData) => {
  try {
    const response = await axios.post(`${process.env.SUNAT_API_URL}/sync`, invoiceData, {
      headers: { 'Authorization': `Bearer ${process.env.SUNAT_API_KEY}` },
    });
 
    return response.data; // Respuesta de sincronización con SUNAT
  } catch (error) {
    console.error('Error al sincronizar con SUNAT:', error.message);
    throw new Error('Error al sincronizar la factura con SUNAT.');
  }
};
 
module.exports = { getClientData, syncInvoiceToSunat };