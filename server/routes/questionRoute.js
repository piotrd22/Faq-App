const router = require("express").Router();
const questionController = require("../controllers/questionController");

router.get("/", questionController.getQuestions);

router.post("/", questionController.postQuestion);

module.exports = router;
