const rateLimit = require("express-rate-limit");

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    responseCode: 429,
    responseMessage: "Too many requests, please try later",
    responseObject: null,
    pageSize: null
  }
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // login/register stricter
  message: {
    responseCode: 429,
    responseMessage: "Too many auth attempts",
    responseObject: null,
    pageSize: null
  }
});
