const https = require('https');
const axios = require('axios');

const agent = new https.Agent({ rejectUnauthorized: false });
const getClientData = async (rucOrDni) => {


  if (/^\d{8}$/.test(rucOrDni)) {
    // Es un DNI
    url = `https://api.apis.net.pe/v2/reniec/dni?numero=${rucOrDni}`;
  } else if (/^\d{11}$/.test(rucOrDni)) {
    // Es un RUC
    url = `https://api.apis.net.pe/v2/sunat/ruc/full?numero=${rucOrDni}`;
  } else {
    throw new Error('El valor proporcionado no es un DNI ni un RUC válido.');
  }


  try {
    const response = await axios.get(url, {
      httpsAgent: agent,
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