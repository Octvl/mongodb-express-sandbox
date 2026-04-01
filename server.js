const express = require('express');
const connectDB = require('./db'); // Reusing your existing connection logic
const Log = require('./models/Log');

const app = express();
const PORT = 3000;

// 1. MIDDLEWARE to let Express understand JSON data
app.use(express.json());

// Connect to MongoDB Atlas cluster
connectDB();

// 3. GET ROUTES (Reading data)
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

// 4. POST ROUTES (Creating data)
app.post('/logs', async (req, res) => {
    try {
        const newLog = new Log({
            action: req.body.action,
            category: req.body.category
        });

        const savedLog = await newLog.save();
        res.status(201).json(savedLog); // 201 means "Created"
    } catch (error) {
        res.status(400).json({ message: "Error saving log", error: error.message });
    }
});

// 5. START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});