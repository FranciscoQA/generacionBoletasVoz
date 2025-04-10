const PDFKit = require('pdfkit');
const fs = require('fs');
const path = require('path');
 
exports.generatePDF = async (invoiceData) => {
    const doc = new PDFKit();
    const filePath = path.join(__dirname, `../../invoices/invoice-${Date.now()}.pdf`);
 
    doc.pipe(fs.createWriteStream(filePath));
    doc.text(`Boleta/Factura para: ${invoiceData.client}`);
    doc.text(`DNI: ${invoiceData.dni}`);
    doc.text(`Productos: ${JSON.stringify(invoiceData.products, null, 2)}`);
    doc.text(`Total: S/ ${invoiceData.total}`);
    doc.end();
 
    return filePath;
};