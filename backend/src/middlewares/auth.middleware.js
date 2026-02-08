const { verifyToken } = require("../utils/token");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization required" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    req._userId = decoded.id;

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
