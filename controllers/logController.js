/**
 * Log Controller
 * This file contains the logic for handling requests related to compliance logs,
 * including fetching logs with optional status filtering and creating new log entries.
 */

// Import the Log model to interact with the database
const Log = require('../models/Log');

/**
 * @desc    Get all compliance logs or filter them by status
 * @route   GET /api/logs
 * @access  Public (Adjust based on authentication needs)
 */
exports.getLogs = async (req, res) => {
    try {
        /**
         * Construct a filter object based on the status query parameter.
         * If 'status' is provided in the URL (e.g., ?status=active), filter by it.
         */
        const filter = req.query.status ? { status: req.query.status } : {};

        // Exclude soft-deleted components (including older documents that lack the field entirely)
        filter.isArchived = { $ne: true };

        /**
         * Find logs in the database matching the filter.
         * Use .collation() with strength 2 for case-insensitive matching.
         */
        const logs = await Log.find(filter).collation({ locale: 'en', strength: 2 });

        // Return the list of logs as JSON
        res.json(logs);
    } catch (error) {
        // Handle server issues and return a 500 Internal Server Error
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Create and save a new compliance log entry
 * @route   POST /api/logs
 * @access  Public (Adjust based on authentication needs)
 */
exports.createLog = async (req, res) => {
    try {
        // Instantiate a new Log object using the request body data
        const newLog = new Log(req.body);

        // Save the new log entry to the database
        const savedLog = await newLog.save();

        // Return the saved log document with a 201 Created status
        res.status(201).json(savedLog);
    } catch (error) {
        /**
         * Handle client errors (e.g., missing required fields) 
         * and return a 400 Bad Request status.
         */
        res.status(400).json({ error: error.message });
    }
};

/**
 * @desc    Soft delete (archive) a compliance log 
 * @route   DELETE /api/logs/:id
 * @access  Public
 */
exports.archiveLog = async (req, res) => {
    try {
        const logId = req.params.id;

        // Use findByIdAndUpdate to flip isArchived true, avoiding a hard delete
        const updatedLog = await Log.findByIdAndUpdate(
            logId,
            { isArchived: true },
            { returnDocument: 'after' } // Returns the updated document 
        );

        if (!updatedLog) {
            return res.status(404).json({ error: "Log not found" });
        }

        res.json({ message: "Log softly deleted (archived) successfully", log: updatedLog });
    } catch (error) {
        // Common error is cast failure (Invalid Object ID)
        res.status(500).json({ error: "Failed to archive log. Check ID format." });
    }
};