/**
 * System Controller
 * This file contains the logic for handling requests related to the system's
 * overall operational status and basic diagnostic information.
 */

// Import the OutreachAttempt model to interact with the database (specifically for counting logs)
const OutreachAttempt = require('../models/OutreachAttempt');

/**
 * @desc    Get the welcome HTML message for the Compliance Engine API
 * @route   GET /api/system/
 * @access  Public
 */
exports.getWelcomeMessage = (req, res) => {
    // Send a simple HTML response for visiting the root of the system API
    res.send('<h1>Compliance Engine API</h1><p>Status: Active. Version: 1.0.0</p>');
};

/**
 * @desc    Retrieve the operational status of the engine, including a log count
 * @route   GET /api/system/status
 * @access  Public
 */
exports.getEngineStatus = async (req, res) => {
    try {
        /**
         * Count the total number of documents in the 'interactions' collection.
         * This provides a quick metric of system activity.
         */
        const count = await OutreachAttempt.countDocuments();
        
        // Return a JSON object with system details
        res.json({
            message: "Compliance Engine Status: Online",
            totalLogsInSystem: count,
            location: "Chicago Server"
        });
    } catch (error) {
        /**
         * If the database is unreachable or the query fails, 
         * return a 500 error with a specific message.
         */
        res.status(500).json({ error: "Database unreachable" });
    }
};