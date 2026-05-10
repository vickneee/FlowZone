const app = require("./app");
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");
const connectDB = require("./config/db");

const server = http.createServer(app);

const isTest = process.env.NODE_ENV === "test";

if (!isTest) connectDB();

const PORT = config.PORT || 4000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown helper
function shutdown(signal) {
  logger.info(`${signal} received. Closing server...`);
  
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
}

// Cloud shutdown (Render, Docker, etc.)
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Local shutdown (Ctrl + C)
process.on("SIGINT", () => shutdown("SIGINT"));
