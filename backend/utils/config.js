const dotenv = require("dotenv");
dotenv.config();

const getMongoURI = () => {
  
  switch (process.env.NODE_ENV) {
    case "test":
      return process.env.TEST_MONGO_URI;
    case "production":
      return process.env.PROD_MONGO_URI;
    default:
      return process.env.DEV_MONGO_URI;
  }
};

const MONGO_URI = getMongoURI();

if (!MONGO_URI) {
  throw new Error("MongoDB URI is missing");
}

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: getMongoURI(),
  JWT_SECRET: process.env.JWT_SECRET,
};
