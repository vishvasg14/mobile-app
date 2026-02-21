const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const ROLES = require("../constants/Roles");
const controller = require("../controllers/admin.controller");

router.get(
  "/interactions/dashboard",
  auth,
  authorize(ROLES.ADMIN),
  controller.dashboardInteractions
);

module.exports = router;
