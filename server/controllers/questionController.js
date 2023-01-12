const Question = require("../models/questionSchema");

const getQuestions = async (req, res) => {
  try {
    const posts = await Question.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
};

const postQuestion = async (req, res) => {
  try {
    const { body, answer } = req.body;
    const newQuestion = new Question({
      body: body,
      answer: answer,
    });

    await newQuestion.save();
    res.status(200).json(newQuestion);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { getQuestions, postQuestion };
