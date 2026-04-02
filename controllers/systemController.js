const Log = require('../models/Log');

exports.getWelcomeMessage = (req, res) => {
    res.send('<h1>Compliance Engine API</h1><p>Status: Active. Version: 1.0.0</p>');
};

exports.getEngineStatus = async (req, res) => {
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
};