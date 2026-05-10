const dotenv = require("dotenv");
dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI:
    process.env.NODE_ENV === "test"
      ? process.env.TEST_MONGO_URI
      : process.env.MONGO_URI,
};

module.exports = config;
