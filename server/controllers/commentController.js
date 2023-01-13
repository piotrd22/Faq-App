const Comment = require("../models/commentSchema");
const Question = require("../models/questionSchema");

const createComment = async (req, res) => {
  try {
    const { body, username, questionId } = req.body;
    const newComment = new Comment({
      body: body,
      username: username,
    });

    await newComment.save();
    await Question.findByIdAndUpdate(
      questionId,
      { $push: { comments: newComment._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.user;

    if (id) {
      await Comment.findByIdAndUpdate(req.params.id, { $set: req.body });
      res.status(200).json("Comment successfully updated.");
    } else {
      res.status(401).json("You are not allowed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.user;

    if (id) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("Comment successfully deleted.");
    } else {
      res.status(401).json("You are not allowed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { createComment, updateComment, deleteComment };
