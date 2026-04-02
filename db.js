/**
 * Database Connection Configuration
 * This file handles the connection to MongoDB Atlas using Mongoose and 
 * environment variables for security.
 */

// Load environment variables from .env file
require('dotenv').config();

// Import Mongoose for database interaction
const mongoose = require('mongoose');

/**
 * Asynchronous function to establish a connection to MongoDB.
 * It uses the URI provided in the environment variables.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB Atlas cluster
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Mongoose connected to MongoDB Atlas!");
    } catch (err) {
        // Log an error message if the connection fails
        console.error("❌ Mongoose connection error:", err.message);
        
        // Exit the process with failure code (1) if the database is unreachable
        process.exit(1);
    }
};

// Export the connection function to be used in server.js or other entry points
module.exports = connectDB;