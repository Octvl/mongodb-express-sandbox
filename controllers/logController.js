const Log = require('../models/Log');

// @desc    Get all logs or filter by status
// @route   GET /api/logs
exports.getLogs = async (req, res) => {
    try {
        // Pass a filter object
        const filter = req.query.status ? { status: req.query.status } : {};
        // Normalize insensitive case
        const logs = await Log.find(filter).collation({ locale: 'en', strength: 2 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create a new compliance log
// @route   POST /api/logs
exports.createLog = async (req, res) => {
    try {
        const newLog = new Log(req.body);
        const savedLog = await newLog.save();
        res.status(201).json(savedLog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};