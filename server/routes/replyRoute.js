const router = require("express").Router();
const replyController = require("../controllers/replyController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", replyController.createReply);

router.put("/:id", verifyToken, replyController.updateReply);

router.delete("/:id", verifyToken, replyController.deleteReply);

module.exports = router;
