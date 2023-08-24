const rateLimit = require('express-rate-limit');

// @ts-ignore
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
});

module.exports = {
  authRateLimiter,
};
