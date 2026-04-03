/**
 * Diagnostic Script: test_models.js
 * 
 * This script verifies:
 * 1. Connection to MongoDB.
 * 2. Successful mapping of Mongoose models to the correct collections.
 * 3. Accessibility of the collections.
 */

const mongoose = require('mongoose');
const connectDB = require('../db');
const DebtorProfile = require('../models/DebtorProfile');
const RegulatoryRule = require('../models/RegulatoryRule');
const OutreachAttempt = require('../models/OutreachAttempt');

async function testConnection() {
    console.log("-----------------------------------------");
    console.log("🔍 Starting Fiber Guardian Data Layer Test...");
    console.log("-----------------------------------------");

    try {
        // 1. Attempt Connection
        await connectDB();
        
        const dbName = mongoose.connection.name;
        console.log(`📡 Connected to Database: [${dbName}]`);

        // 2. Verify Model Collection Mappings
        const models = [
            { name: 'DebtorProfile', model: DebtorProfile, expected: 'accounts' },
            { name: 'RegulatoryRule', model: RegulatoryRule, expected: 'rules' },
            { name: 'OutreachAttempt', model: OutreachAttempt, expected: 'interactions' }
        ];

        console.log("\n📁 Verifying Collection Mappings:");
        for (const item of models) {
            const actual = item.model.collection.name;
            const status = (actual === item.expected) ? "✅ MATCH" : "❌ MISMATCH";
            console.log(`   - ${item.name} -> Collection: [${actual}] (${status})`);
        }

        // 3. Test Read Operations (Count)
        console.log("\n📊 Current Document Counts:");
        for (const item of models) {
            try {
                const count = await item.model.countDocuments();
                console.log(`   - ${item.expected}: ${count} documents`);
            } catch (err) {
                console.error(`   - ❌ Error counting ${item.expected}:`, err.message);
            }
        }

        console.log("\n-----------------------------------------");
        console.log("✅ Diagnostic Complete.");
        console.log("-----------------------------------------");

    } catch (error) {
        console.error("Critical Test Failure:", error.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

testConnection();
