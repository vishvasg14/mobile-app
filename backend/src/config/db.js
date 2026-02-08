const mongoose = require("mongoose");
const { mongoUri } = require("./env");
const logger = require("./logger");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
