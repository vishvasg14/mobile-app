const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  },
  logLevel: process.env.LOG_LEVEL || "info",
  swaggerShowAdmin: process.env.SWAGGER_SHOW_ADMIN === "true"
};
