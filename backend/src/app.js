const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware");
const { swaggerUi, swaggerDocument } = require("./config/swagger");
const corsOptions = require("./config/cors");

const app = express();

/**
 * Security middlewares (ORDER MATTERS)
 */
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(cors(corsOptions));

app.use(express.json({ limit: "5mb" }));

const sanitizeOptions = {
  replaceWith: "_",
  onSanitize: ({ req, key }) => {
    // optional: log sanitization
  }
};

const sanitizeKey = (req, key) => {
  const target = req[key];
  if (!target) return;
  const hadProhibited = mongoSanitize.has(target, sanitizeOptions.allowDots);
  mongoSanitize.sanitize(target, sanitizeOptions);
  if (hadProhibited && typeof sanitizeOptions.onSanitize === "function") {
    sanitizeOptions.onSanitize({ req, key });
  }
};

app.use((req, res, next) => {
  ["body", "params", "headers", "query"].forEach((key) =>
    sanitizeKey(req, key)
  );
  next();
});

/**
 * Swagger
 */
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * API Routes
 */
app.use("/api", routes);

/**
 * Centralized error handler (LAST)
 */
app.use(errorHandler);

module.exports = app;
