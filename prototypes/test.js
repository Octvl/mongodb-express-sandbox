/**
 * Sandbox Test Script (test.js)
 * 
 * This standalone script is used to verify the database connection 
 * and perform a simple "ping" and "insert" operation using Mongoose
 * to ensure the modular structure is working correctly.
 */

// Import the database connection utility and Mongoose
const connectDB = require('../db');
const mongoose = require('mongoose');

/**
 * runTest function handles the connection test and a sample insertion.
 */
async function runTest() {
    try {
        // Establish connection to the MongoDB server using Mongoose wrapper
        await connectDB();
        
        // Execute a ping command to the admin database to verify the connection is active
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("✅ Sandbox: Connection is rock solid!");

        // Select the 'sandbox_db' database and 'learning_logs' collection natively from Mongoose client
        const database = mongoose.connection.client.db("sandbox_db");
        const collection = database.collection("learning_logs");
        
        // Insert a sample document into the collection
        const result = await collection.insertOne({
            task: "Testing my new modular structure with Mongoose connection integration",
            date: new Date()
        });

        // Log the success message with the inserted document's ID
        console.log(`🚀 Success! Document inserted with ID: ${result.insertedId}`);
    } catch (error) {
        // Log any errors that occurred during the connection or insertion
        console.error("❌ Sandbox Error:", error);
    } finally {
        // Ensure the database connection is cleanly closed
        await mongoose.connection.close();
    }
}

// Execute the test function
runTest();