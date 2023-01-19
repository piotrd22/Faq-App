const Question = require("../models/questionSchema");
const User = require("../models/userSchema");
const Comment = require("../models/commentSchema");

const getQuestions = async (req, res) => {
  try {
    const { search, sort } = req.query;

    if (search && sort) {
      const questions = await Question.aggregate([
        {
          $project: {
            content: { $concat: ["$body", " ", "$answer"] },
            body: 1,
            answer: 1,
            createdAt: 1,
            updatedAt: 1,
            _id: 1,
            comments: 1,
          },
        },
        { $match: { content: { $regex: new RegExp(search), $options: "i" } } },
        { $sort: { updatedAt: sort === "asc" ? 1 : -1 } },
      ]);

      await Comment.populate(questions, { path: "comments" });
      return res.status(200).json(questions);
    } else if (search) {
      const questions = await Question.aggregate([
        {
          $project: {
            content: { $concat: ["$body", " ", "$answer"] },
            body: 1,
            answer: 1,
            createdAt: 1,
            updatedAt: 1,
            _id: 1,
            comments: 1,
          },
        },
        { $match: { content: { $regex: new RegExp(search), $options: "i" } } },
      ]);

      await Comment.populate(questions, { path: "comments" });
      return res.status(200).json(questions);
    } else if (sort) {
      const questions = await Question.find({})
        .sort({ updatedAt: sort === "asc" ? 1 : -1 })
        .populate("comments");
      return res.status(200).json(questions);
    }

    const questions = await Question.find({}).sort({updatedAt: -1}).populate("comments");
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
    const currQuestion = await Question.findById(req.params.id);

    if (user.admin) {
      await Comment.deleteMany({ _id: { $in: currQuestion.comments } });
      await Question.findByIdAndDelete(req.params.id);
      res.status(200).json("Question successfully deleted.");
    } else {
      res.status(401).json("You are not allowed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getQuestionById = async (req, res) => {
  try {
    const questions = await Question.findById(req.params.id).populate(
      "comments"
    );
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getQuestions,
  postQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
};
