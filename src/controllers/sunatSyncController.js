const { models } = require('../models');
 
const createSyncRecord = async (req, res) => {
  try {
    const { invoiceId, status, sunatResponseCode, sunatMessage, syncDate } = req.body;
    const syncRecord = await models.SUNATSync.create({ invoiceId, status, sunatResponseCode, sunatMessage, syncDate });
    res.status(201).json(syncRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error creating sync record', details: error.message });
  }
};
 
const getSyncRecords = async (req, res) => {
  try {
    const records = await models.SUNATSync.findAll();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sync records', details: error.message });
  }
};
 
module.exports = {
  createSyncRecord,
  getSyncRecords,
};