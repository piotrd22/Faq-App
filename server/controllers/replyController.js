const Reply = require("../models/replySchema");
const Comment = require("../models/commentSchema");

const createReply = async (req, res) => {
  try {
    const { body, username, commentId } = req.body;
    const newReply = new Reply({
      body: body,
      username: username,
    });

    await newReply.save();
    await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: newReply._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json(newReply);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateReply = async (req, res) => {
  try {
    const { id } = req.user;

    if (id) {
      await Reply.findByIdAndUpdate(req.params.id, { $set: req.body });
      res.status(200).json("Reply successfully updated.");
    } else {
      res.status(401).json("You are not allowed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteReply = async (req, res) => {
  try {
    const { id } = req.user;

    if (id) {
      await Reply.findByIdAndDelete(req.params.id);
      res.status(200).json("Reply successfully deleted.");
    } else {
      res.status(401).json("You are not allowed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { createReply, updateReply, deleteReply };
