const rateLimiter = require('express-rate-limit');

const limit = rateLimiter({
  windowMs: 600000, // 10 min
  max: 100,
});

module.exports = limit;
