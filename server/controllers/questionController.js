const Question = require("../models/questionSchema");
const User = require("../models/userSchema");

const getQuestions = async (req, res) => {
  try {
    const { search } = req.query;

    if (search) {
      const questions = await Question.aggregate([
        {
          $project: {
            content: { $concat: ["$body", " ", "$answer"] },
            body: 1,
            answer: 1,
            createdAt: 1,
            _id: 1,
          },
        },
        { $match: { content: { $regex: new RegExp(search), $options: "i" } } },
      ]);
      return res.status(200).json(questions);
    }

    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json(error);
  }
};

const postQuestion = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (user.admin) {
      const { body, answer } = req.body;
      const newQuestion = new Question({
        body: body,
        answer: answer,
      });

      await newQuestion.save();
      res.status(200).json(newQuestion);
    } else {
      res.status(401).json("You are not allowed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (user.admin) {
      await Question.findByIdAndUpdate(req.params.id, { $set: req.body });
      res.status(200).json("Question successfully updated.");
    } else {
      res.status(401).json("You are not allowed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (user.admin) {
      await Question.findByIdAndDelete(req.params.id);
      res.status(200).json("Question successfully deleted.");
    } else {
      res.status(401).json("You are not allowed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { getQuestions, postQuestion, updateQuestion, deleteQuestion };
