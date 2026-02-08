const router = require("express").Router();
const { getPublicCard } = require("../controllers/card.controller");

router.get("/:code", getPublicCard);

module.exports = router;
