const mongoose = require('mongoose');
const connectDB = require('../db');
const DebtorProfile = require('../models/DebtorProfile');

async function seed() {
    // Connect to MongoDB using your existing config
    await connectDB();
    
    const TARGET_ID = '65e23f1a23b4c5d6e7f8aaaa';

    try {
        // Check if it's already there
        const existing = await DebtorProfile.findById(TARGET_ID);
        if (existing) {
            console.log(`Mock debtor ${TARGET_ID} already exists in the database!`);
            mongoose.connection.close();
            return;
        }

        // Create the specific mock user defined in the PRD and API Tests
        const mockDebtor = new DebtorProfile({
            _id: new mongoose.Types.ObjectId(TARGET_ID),
            firstName: "John",
            lastName: "Doe",
            state: "NY",
            timezone: "America/New_York", // Crucial for Luxon math
            phone: "+12125550101"
        });

        await mockDebtor.save();
        console.log(`✅ Successfully seeded Mock Debtor with ID: ${TARGET_ID}`);

    } catch (err) {
        console.error("❌ Error seeding debtor:", err);
    } finally {
        // Clean up connection so script ends naturally
        mongoose.connection.close();
    }
}

seed();
