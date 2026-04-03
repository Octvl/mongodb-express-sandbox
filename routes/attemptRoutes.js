const express = require('express');
const router = express.Router();
const { getAttempts, archiveAttempt } = require('../controllers/outreachController');

router.route('/')
    .get(getAttempts);

router.route('/:id')
    .delete(archiveAttempt);

module.exports = router;
