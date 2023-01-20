const router = require("express").Router();
const statsController = require("../controllers/statsController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, statsController.getStats);

module.exports = router;
