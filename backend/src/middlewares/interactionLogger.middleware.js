const InteractionLog = require("../models/InteractionLog");
const { verifyToken } = require("../utils/token");

const getRequestIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
};

module.exports = (req, res, next) => {
  if (!req.originalUrl.startsWith("/api")) {
    return next();
  }

  const startedAt = Date.now();
  let authContext = null;
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    try {
      authContext = verifyToken(header.split(" ")[1]);
    } catch {
      authContext = null;
    }
  }

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const entry = {
      ip: getRequestIp(req),
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      userAgent: req.headers["user-agent"] || "unknown",
      userId: authContext?.id || null,
      userRole: authContext?.role || null
    };

    InteractionLog.create(entry).catch((err) => {
      // Non-blocking: logging failures should never affect API responses.
      console.error("Interaction logging failed:", err.message);
    });
  });

  next();
};
