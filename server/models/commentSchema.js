const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      max: 20,
    },
    body: {
      type: String,
      required: true,
      max: 400,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
