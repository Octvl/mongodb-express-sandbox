/**
 * Application Demonstration Script (app.js)
 * 
 * This script serves as a standalone execution file to demonstrate basic 
 * MongoDB operations (CRUD) using Mongoose outside of the Express server environment.
 * It connects to the database, performs a specific operation (e.g., finding and deleting a log), 
 * and then closes the connection.
 */

// Import the database connection utility
const connectDB = require('../db');

// Import the Log model to perform queries
const Log = require('../models/Log');

// Import mongoose to manage the connection state (e.g., closing it)
const mongoose = require('mongoose');

/**
 * Main execution function
 * Wraps the asynchronous database operations.
 */
async function runHelloWorld() {
    // Await the connection to the MongoDB Atlas cluster
    await connectDB();

    try {
        // --- STEP 1: FIND A TARGET ---
        // Searches the collection for a single document where the action contains the word "Mastered"
        const targetLog = await Log.findOne({ action: /Mastered/ });

        if (targetLog) {
            console.log(`\n🗑️ Preparing to delete log with ID: ${targetLog._id}`);

            // --- STEP 2: DELETE ---
            // Executes the deletion of the found document by its Object ID
            const deletedResult = await Log.findByIdAndDelete(targetLog._id);

            // Log success if the operation returned the deleted document
            if (deletedResult) {
                console.log("✅ Delete successful! The document is no longer in the database.");
            }
        } else {
            // Log a warning if no matching document was found to delete
            console.log("⚠️ No log found matching that criteria to delete.");
        }

        // --- STEP 3: VERIFY ---
        // Count the remaining documents to verify the state of the database
        const count = await Log.countDocuments();
        console.log(`\n📊 Current total logs in database: ${count}`);

    } catch (error) {
        // Catch and log any errors that occur during the database operations
        console.error("❌ Error during Delete:", error);
    } finally {
        // --- STEP 4: CLEANUP ---
        // Always close the database connection when finished, regardless of success or failure
        await mongoose.connection.close();
        console.log("\n🔌 Connection closed.");
    }
}

// Execute the main function
runHelloWorld();