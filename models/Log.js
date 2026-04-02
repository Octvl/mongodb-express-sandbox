const mongoose = require('mongoose');

// The Log Schema
const logSchema = new mongoose.Schema({
    action: {
        type: String,
        required: [true, 'An action description is required.']
    },
    category: {
        type: String,
        required: [true, 'A category is required for regulatory tracking.'],
        enum: ['Compliance', 'Outreach', 'Maintenance', 'General'],
        message: '{VALUE} is not a valid category. Please use Compliance, Outreach, Maintenance, or General.'
    },
    // --- NEW STATUS FIELD --- 
    status: {
        type: String,
        required: true,
        enum: {
            values: ['Pending', 'Passed', 'Failed'],
            message: '{VALUE} is not a valid status. Please use Pending, Passed, or Failed.'
        },
        default: 'Pending' // Every log starts as Pending until verified
    },
    // --- END OF STATUS FIELD ---
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// The Model - This creates a 'logs' collection in MongoDB
const Log = mongoose.model('Log', logSchema);
module.exports = Log;