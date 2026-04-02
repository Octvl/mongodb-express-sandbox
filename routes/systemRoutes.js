/**
 * System Routes Configuration
 * Defines the API endpoints for system-level checks such as health status
 * and general system information.
 */

// Import necessary modules
const express = require('express');
const router = express.Router();

// Import controller functions for system-related routes
const { getWelcomeMessage, getEngineStatus } = require('../controllers/systemController');

/**
 * @route GET /
 * @desc Get the welcome message for the system
 */
router.get('/', getWelcomeMessage);

/**
 * @route GET /status
 * @desc Check the operational status of the engine
 */
router.get('/status', getEngineStatus);

// Export the router to be used in the main application
module.exports = router;