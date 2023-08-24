const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
// const httpStatus = require('http-status');
const config = require('./config/config');
const { jwtStrategy } = require('./config/passport');
const morgan = require('./middlewares/morgan');
const { authRateLimiter } = require('./middlewares/rateLimit');

const routes = require('./routes/v1');

const app = express();

if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

if (config.env === 'production') {
    app.use('/v1/auth', authRateLimiter);
}

// app.use((req, res, next) => {
// next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
// });

app.use('/v1', routes);

module.exports = app;