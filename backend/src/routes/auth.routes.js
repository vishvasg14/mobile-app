const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");
const {
  registerSchema,
  loginSchema,
  resetPasswordSchema
} = require("../validators/auth.validator");

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  controller.resetPassword
);
router.get("/users", controller.listUsers);
router.get("/me", auth, controller.me);

module.exports = router;
