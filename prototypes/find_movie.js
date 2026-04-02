/**
 * Movie Query Script (find_movie.js)
 * 
 * This standalone script demonstrates how to connect to a specific MongoDB database 
 * (sample_mflix) and query a collection (movies) for a single document 
 * based on a specific criteria (year: 1994). This script now integrates with Mongoose.
 */

// Import the Mongoose database connection utility
const connectDB = require('../db');
const mongoose = require('mongoose');

/**
 * findMovie function handles the database connection, 
 * query execution, and result display.
 */
async function findMovie() {
    try {
        // Establish connection to the MongoDB server via Mongoose
        await connectDB();
        
        // Select the 'sample_mflix' database directly from the Mongoose client connection
        const db = mongoose.connection.client.db('sample_mflix');
        
        // Access the 'movies' collection
        const movies = db.collection('movies');
        
        // Define the search criteria: Movies released in 1994
        const query = { year: 1994 };
        
        /**
         * Execute the findOne query.
         * Using projection to only return the title and exclude the _id.
         */
        const movie = await movies.findOne(query, { projection: { _id: 0, title: 1 } });

        // Check if a matching movie was found and log the result
        if (movie) {
            console.log(`🎬 Found a movie from 1994: ${movie.title}`);
        } else {
            console.log(`❌ No movie found from 1994`);
        }
    } catch (error) {
        // Log any errors that occurred during the process
        console.error("Error:", error);
    } finally {
        // Ensure the Mongoose connection is gracefully closed after the operation
        await mongoose.connection.close();
    }
}

// Execute the query function
findMovie();
