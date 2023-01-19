const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReplySchema = new Schema(
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

const Reply = mongoose.model("Reply", ReplySchema);

module.exports = Reply;
