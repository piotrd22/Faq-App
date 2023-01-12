const router = require("express").Router();
const questionController = require("../controllers/questionController");

router.get("/", questionController.getQuestions);

router.post("/", questionController.postQuestion);

router.put("/:id", questionController.updateQuestion);

router.delete("/:id", questionController.deleteQuestion);

module.exports = router;
