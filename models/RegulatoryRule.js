const mongoose = require('mongoose');

const regulatoryRuleSchema = new mongoose.Schema({
  state: { 
    type: String, 
    required: true, 
    unique: true 
    // Critical for FDCPA: 1-to-1 mapping to enforce specific state restrictions
  },
  allowedHours: {
    start: { type: String, required: true }, // e.g., "08:00"
    end: { type: String, required: true }    // e.g., "21:00"
    // Validated strictly as "HH:mm" strings to easily plug into Luxon comparisons
  },
  frequencyCap: { 
    type: Number, 
    default: 7 
    // Regulation F compliance: Limits outreach to max call attempts inside a 7-day rolling window
  },
  specialConstraints: { 
    type: [String], 
    default: [] 
  }
});

// Explicitly mapping to the "rules" collection
module.exports = mongoose.model('RegulatoryRule', regulatoryRuleSchema, 'rules');
