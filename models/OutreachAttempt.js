const mongoose = require('mongoose');

const outreachAttemptSchema = new mongoose.Schema({
  debtorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DebtorProfile', 
    required: true 
  },
  transcript: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PASSED', 'BLOCKED_TIME', 'BLOCKED_FREQUENCY', 'BLOCKED_CONTENT', 'ERROR'], 
    required: true 
    // Critical audit trail: explicitly tags if the deterministic or probabilistic gate caught the violation
  },
  aiReasoning: { 
    type: String 
    // Stores the granular 'Reasoning Artifact' string generated from the Local LLM inference
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Explicitly mapping to the "interactions" collection
module.exports = mongoose.model('OutreachAttempt', outreachAttemptSchema, 'interactions');
