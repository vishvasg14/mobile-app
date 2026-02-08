const fs = require("fs");
const path = require("path");
const { errorResponse } = require("../utils/response");

const logErrorToFile = (err) => {
  try {
    const logDir = path.join(__dirname, "..", "..", "logs");
    fs.mkdirSync(logDir, { recursive: true });
    const date = new Date();
    const day = date.toISOString().slice(0, 10); // YYYY-MM-DD
    const logPath = path.join(logDir, `error-${day}.log`);
    const stamp = new Date().toISOString();
    const msg = err && err.stack ? err.stack : String(err);
    fs.appendFileSync(logPath, `[${stamp}] ${msg}\n`);
  } catch (logErr) {
    console.error("[error][logger]", logErr);
  }
};

module.exports = (err, req, res, next) => {
  // Log full error to help trace unexpected runtime failures
  console.error("[error]", err);
  logErrorToFile(err);
  return errorResponse({
    res,
    responseCode: err.status || 500,
    responseMessage:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error"
  });
};
