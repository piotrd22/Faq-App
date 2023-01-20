const Question = require("../models/questionSchema");
const User = require("../models/userSchema");
const Comment = require("../models/commentSchema");
const Reply = require("../models/replySchema");

const getStats = async (req, res) => {
  try {
    const { search } = req.query;

    const currentDate = new Date();

    if (search === "month") {
      const lastMonthDate = new Date(
        currentDate.setHour(currentDate.getHour() - 720)
      );
      const comments = await Comment.find({
        createdAt: { $gt: lastMonthDate },
      });
      const replies = await Reply.find({ createdAt: { $gt: lastMonthDate } });
      const questions = await Question.find({
        createdAt: { $gt: lastMonthDate },
      });
      const users = await User.find({ createdAt: { $gt: lastMonthDate } });

      const objToRes = {
        comments: comments.length + replies.length,
        questions: questions.length,
        users: users.length,
      };

      return res.status(200).json(objToRes);
    }

    if (search === "day") {
      const lastDayDate = new Date(
        currentDate.setHours(currentDate.getHours() - 24)
      );
      const comments = await Comment.find({ createdAt: { $gt: lastDayDate } });
      const replies = await Reply.find({ createdAt: { $gt: lastDayDate } });
      const questions = await Question.find({
        createdAt: { $gt: lastDayDate },
      });
      const users = await User.find({ createdAt: { $gt: lastDayDate } });

      const objToRes = {
        comments: comments.length + replies.length,
        questions: questions.length,
        users: users.length,
      };

      return res.status(200).json(objToRes);
    }

    if (search === "week") {
      const lastWeekDate = new Date(
        currentDate.setHours(currentDate.getHours() - 168)
      );
      const comments = await Comment.find({ createdAt: { $gt: lastWeekDate } });
      const replies = await Reply.find({ createdAt: { $gt: lastWeekDate } });
      const questions = await Question.find({
        createdAt: { $gt: lastWeekDate },
      });
      const users = await User.find({ createdAt: { $gt: lastWeekDate } });

      const objToRes = {
        comments: comments.length + replies.length,
        questions: questions.length,
        users: users.length,
      };

      return res.status(200).json(objToRes);
    }

    if (search === "year") {
      const lastYearDate = new Date(
        currentDate.setHours(currentDate.getHours() - 8760)
      );
      const comments = await Comment.find({ createdAt: { $gt: lastYearDate } });
      const replies = await Reply.find({ createdAt: { $gt: lastYearDate } });
      const questions = await Question.find({
        createdAt: { $gt: lastYearDate },
      });
      const users = await User.find({ createdAt: { $gt: lastYearDate } });

      const objToRes = {
        comments: comments.length + replies.length,
        questions: questions.length,
        users: users.length,
      };

      return res.status(200).json(objToRes);
    }

    const comments = await Comment.find({});
    const replies = await Reply.find({});
    const questions = await Question.find({});
    const users = await User.find({});

    const objToRes = {
      comments: comments.length + replies.length,
      questions: questions.length,
      users: users.length,
    };

    return res.status(200).json(objToRes);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { getStats };
