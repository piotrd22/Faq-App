const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const signup = async (req, res) => {
  try {
    const { username, password, admin } = req.body;

    if ((await User.find({ username: username })).length !== 0) {
      return res.status(405).json("Username is already taken");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassw = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      password: hashedPassw,
      admin: admin,
    });

    await newUser.save();

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

const signin = async (req, res) => {
  try {
    const { username } = req.body;

    const log_user = await User.findOne({
      username: username,
    });
    if (!log_user) {
      return res.status(404).json("404 USER NOT FOUND");
    }

    const userPassw = await bcrypt.compare(
      req.body.password,
      log_user.password
    );
    if (!userPassw) {
      return res.status(409).json("409 WRONG PASSWORD");
    }

    const accessToken = jwt.sign(
      { id: log_user._id, admin: log_user.admin },
      process.env.SECRET,
      { expiresIn: "5d" }
    );

    const { password, ...rest } = log_user._doc;

    res.status(200).json({ ...rest, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { signin, signup };
