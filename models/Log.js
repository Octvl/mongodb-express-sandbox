/**
 * Log Model Definition
 * This file defines the schema for compliance logs stored in MongoDB.
 */

const mongoose = require('mongoose');

/**
 * logSchema defines the structure of each log entry.
 * Includes fields for action description, category, status, and timestamp.
 */
const logSchema = new mongoose.Schema({
    // The description of the action being logged
    action: {
        type: String,
        required: [true, 'An action description is required.']
    },
    
    // The category of the log for regulatory tracking purposes
    category: {
        type: String,
        required: [true, 'A category is required for regulatory tracking.'],
        enum: ['Compliance', 'Outreach', 'Maintenance', 'General'],
        message: '{VALUE} is not a valid category. Please use Compliance, Outreach, Maintenance, or General.'
    },

    /**
     * status field tracks the verification state of the log entry.
     * New logs default to 'Pending'.
     */
    status: {
        type: String,
        required: true,
        enum: {
            values: ['Pending', 'Passed', 'Failed'],
            message: '{VALUE} is not a valid status. Please use Pending, Passed, or Failed.'
        },
        default: 'Pending' // Every log starts as Pending until verified manually or via automation
    },

    // --- NEW ARCHIVE FIELD ---
    /**
     * isArchived field enables "Soft Deletes".
     * True means the log is hidden from regular queries but preserved for audit history.
     */
    isArchived: {
        type: Boolean,
        default: false
    },
    // --- END OF ARCHIVE FIELD ---

    // The date and time when the log entry was created
    timestamp: {
        type: Date,
        default: Date.now
    }
});

/**
 * Initialize the Log model.
 * This creates (or connects to) the 'logs' collection in the MongoDB database.
 */
const Log = mongoose.model('Log', logSchema);

// Export the Log model for use in other parts of the application
module.exports = Log;