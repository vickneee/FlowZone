const app = require("./app");
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");

const server = http.createServer(app);

const PORT = config.PORT || 4000;

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Closing server...");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});
