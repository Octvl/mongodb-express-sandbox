/**
 * Log Routes Configuration
 * Defines the API endpoints for managing compliance logs.
 */

const express = require('express');
const router = express.Router();

/**
 * Destructure controller functions to handle incoming 
 * requests for log retrieval, creation, and archiving.
 */
const { getLogs, createLog, archiveLog } = require('../controllers/logController');

/**
 * Route: /api/logs
 * Note: All paths here are relative to where the router is mounted in server.js.
 * 
 * GET  - Retrieve logs (supports optional filtering via query parameters)
 * POST - Create a new log entry
 */
router.route('/')
    .get(getLogs)
    .post(createLog);

/**
 * Route: /api/logs/:id
 * DELETE - Soft delete (archive) a specific log by its ID
 */
router.route('/:id')
    .delete(archiveLog);

// Export the router to be used in the main application
module.exports = router;