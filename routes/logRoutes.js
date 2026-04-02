const express = require('express');
const router = express.Router();
const { getLogs, createLog } = require('../controllers/logController');

// All paths here are relative to where the router is mounted in server.js
router.route('/').get(getLogs).post(createLog);

module.exports = router;