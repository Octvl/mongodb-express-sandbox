const mongoose = require('mongoose');

// The Blueprint (Schema)
const logSchema = new mongoose.Schema({
    action: { type: String, required: true },
    category: { type: String, default: 'General' },
    timestamp: { type: Date, default: Date.now }
});

// The Tool (Model) - This creates a 'logs' collection in MongoDB
const Log = mongoose.model('Log', logSchema);

module.exports = Log;