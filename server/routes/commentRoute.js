const router = require("express").Router();
const commentController = require("../controllers/commentController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", commentController.createComment);

router.get("/:id", commentController.getComment);

router.put("/:id", verifyToken, commentController.updateComment);

router.delete("/:id", verifyToken, commentController.deleteComment);

module.exports = router;
