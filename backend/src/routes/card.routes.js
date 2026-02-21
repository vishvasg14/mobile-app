const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/card.controller");
const ROLES = require("../constants/Roles");
const authorize = require("../middlewares/role.middleware");

router.post("/ocr", auth, controller.ingestCard);
router.get("/", auth, controller.getMyCards);
router.get("/:id", auth, controller.getMyCardById);
router.patch("/:id", auth, controller.updateCard);
router.patch("/:id/public", auth, controller.togglePublic);
router.delete("/:id", auth, controller.deleteCard);
router.get(
  "/admin/all",
  auth,
  authorize(ROLES.ADMIN),
  controller.adminGetAllCards,
);

module.exports = router;
