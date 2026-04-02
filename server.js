const express = require('express');
const connectDB = require('./db'); // Reusing your existing connection logic
const Log = require('./models/Log');

const app = express();
const PORT = 3000;

// 1. MIDDLEWARE to let Express understand JSON data
app.use(express.json());

// 2. Connect to MongoDB Atlas cluster
connectDB();

// 3. Mount the routes
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/system', require('./routes/systemRoutes'));

// If someone hits the absolute root, redirect them to the system info
app.get('/', (req, res) => res.redirect('/api/system'));

// 4. START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});