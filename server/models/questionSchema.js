const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
      max: 400,
    },
    answer: {
      type: String,
      required: true,
      max: 700,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
