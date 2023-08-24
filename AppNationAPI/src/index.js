const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const log = require('./config/log');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  log.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    log.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      log.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  log.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  log.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
