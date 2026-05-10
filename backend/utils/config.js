const dotenv = require("dotenv");
dotenv.config();

const getMongoURI = () => {
  
  switch (process.env.NODE_ENV) {
    case "test":
      return process.env.MONGO_URI_TEST;
    case "production":
      return process.env.MONGO_URI_PROD;
    default:
      return process.env.MONGO_URI_DEV;
  }
};

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: getMongoURI(),
  JWT_SECRET: process.env.JWT_SECRET,
};
