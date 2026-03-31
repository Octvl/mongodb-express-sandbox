const connectDB = require('./db');
const Log = require('./models/Log');
const mongoose = require('mongoose');

async function runHelloWorld() {
    await connectDB();

    try {
        // --- STEP 1: FIND A TARGET ---
        const targetLog = await Log.findOne({ action: /Mastered/ }); // Finds a log with "Mastered" in the text

        if (targetLog) {
            console.log(`\n🗑️ Preparing to delete log with ID: ${targetLog._id}`);

            // --- STEP 2: DELETE ---
            const deletedResult = await Log.findByIdAndDelete(targetLog._id);

            if (deletedResult) {
                console.log("✅ Delete successful! The document is no longer in the database.");
            }
        } else {
            console.log("⚠️ No log found matching that criteria to delete.");
        }

        // --- STEP 3: VERIFY ---
        const count = await Log.countDocuments();
        console.log(`\n📊 Current total logs in database: ${count}`);

    } catch (error) {
        console.error("❌ Error during Delete:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Connection closed.");
    }
}

runHelloWorld();