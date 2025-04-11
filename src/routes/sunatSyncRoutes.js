const express = require('express');
const sunatSyncController = require('../controllers/sunatSyncController');
 
const router = express.Router();
 
router.post('/create', sunatSyncController.createSyncRecord);
router.get('/', sunatSyncController.getSyncRecords);
 
module.exports = router;