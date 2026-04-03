const mongoose = require('mongoose');

const debtorProfileSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true, 
    minlength: [2, 'State must be a 2-character abbreviation'], 
    maxlength: [2, 'State must be a 2-character abbreviation'],
    uppercase: true,
    // Critical for FDCPA: State residency dictates which timezone and specific 
    // regulatory laws apply to this debtor. 
  },
  timezone: { 
    type: String, 
    required: true 
    // Critical for FDCPA: We use this string (e.g. 'America/Los_Angeles') to determine 
    // real-time local hours dynamically using Luxon, preventing deterministic violations.
  },
  phone: { 
    type: String, 
    required: true, 
    select: false // PII protection: omits the protected phone number from arbitrary queries
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Explicity mapping to the "accounts" collection
module.exports = mongoose.model('DebtorProfile', debtorProfileSchema, 'accounts');
