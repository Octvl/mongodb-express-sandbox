const express = require('express');
const router = express.Router();
const { validateOutreach } = require('../controllers/outreachController');

router.post('/validate', validateOutreach);

module.exports = router;
