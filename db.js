require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Mongoose connected to MongoDB Atlas!");
    } catch (err) {
        console.error("❌ Mongoose connection error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;