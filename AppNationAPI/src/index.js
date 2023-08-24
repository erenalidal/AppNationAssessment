const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config/config');
const log = require('./config/log');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    log.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    log.info(`Listening to port ${config.port}`);
  });
});