const router = require("express").Router();
const questionController = require("../controllers/questionController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", questionController.getQuestions);

router.post("/", verifyToken, questionController.postQuestion);

router.put("/:id", verifyToken, questionController.updateQuestion);

router.delete("/:id", verifyToken, questionController.deleteQuestion);

module.exports = router;
