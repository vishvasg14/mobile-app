const router = require("express").Router();
const { apiLimiter, authLimiter } = require("../middlewares/rateLimit.middleware");

router.get("/health", (_, res) => {
  res.json({ status: "UP" });
});

router.use("/auth", authLimiter, require("./auth.routes"));
router.use("/cards", apiLimiter, require("./card.routes"));
router.use("/public", apiLimiter, require("./public.routes"));
router.use("/admin", apiLimiter, require("./admin.routes"));

module.exports = router;
