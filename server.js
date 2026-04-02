/**
 * Main application entry point for the FinTech Project server.
 * This file initializes the Express application, connects to the database,
 * and sets up middleware and routes.
 */

// Import required modules and dependencies
const express = require('express');
const connectDB = require('./db'); // Reusing existing MongoDB connection logic
const Log = require('./models/Log'); // Log model for database interactions

// Initialize the Express application
const app = express();

// Define the port for the server to listen on
const PORT = 3000;

/**
 * 1. MIDDLEWARE
 * express.json() is built-in middleware to parse incoming requests with JSON payloads.
 */
app.use(express.json());

/**
 * 2. DATABASE CONNECTION
 * Establishes a connection to the MongoDB Atlas cluster.
 */
connectDB();

/**
 * 3. ROUTES MOUNTING
 * Separate route files handle different API endpoints for better organization.
 */
// Mount logs-related routes under /api/logs
app.use('/api/logs', require('./routes/logRoutes'));

// Mount system-related routes (status, welcome) under /api/system
app.use('/api/system', require('./routes/systemRoutes'));

/**
 * ROOT REDIRECT
 * If someone hits the absolute root URL ('/'), automatically redirect them
 * to the system info page for a better user experience.
 */
app.get('/', (req, res) => res.redirect('/api/system'));

/**
 * 4. START SERVER
 * Binds and listens for connections on the specified host and port.
 */
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});