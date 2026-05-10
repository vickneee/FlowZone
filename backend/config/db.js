const mongoose = require("mongoose");
const config = require("../utils/config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
