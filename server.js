const express = require('express');
const connectDB = require('./db'); // Reusing your existing connection logic
const Log = require('./models/Log');

const app = express();
const PORT = 3000;

// Middleware to let Express understand JSON data
app.use(express.json());

// Connect to your MongoDB Atlas cluster
connectDB();

// --- THE "HELLO WORLD" ROUTE ---
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1><p>The Express server is officially live.</p>');
});

// --- A ROUTE TO SEE YOUR DATABASE DATA ---
app.get('/status', async (req, res) => {
    try {
        const count = await Log.countDocuments();
        res.json({
            message: "Compliance Engine Status: Online",
            totalLogsInSystem: count,
            location: "Chicago Server"
        });
    } catch (error) {
        res.status(500).json({ error: "Database unreachable" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});