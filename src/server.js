import ExpressApplication from "./app.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 3000;

const app = new ExpressApplication(PORT);
const server = app.start();

server.requestTimeout = 30000;
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

process.on("SIGTERM", () => {
  logger.warn("SIGTERM RECEIVED!");
  server.close(() => {
    logger.warn("Process Terminated!");
  });
});
