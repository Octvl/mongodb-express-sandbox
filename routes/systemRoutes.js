const express = require('express');
const router = express.Router();
const { getWelcomeMessage, getEngineStatus } = require('../controllers/systemController');

router.get('/', getWelcomeMessage);
router.get('/status', getEngineStatus);

module.exports = router;