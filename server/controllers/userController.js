const bcrypt = require("bcrypt");
const User = require("../models/userSchema");

const getAllUsers = async (req, res) => {
  try {
    res.status(200).json(await User.find({}));
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    res.status(200).json(await User.findById(req.params.id));
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const { password } = req.body;
  const { id, admin } = req.user;

  if (req.params.id === id || admin) {
    if ((await User.find({ username: req.body.username })).length !== 0) {
      return res.status(405).json("Username is already taken");
    }

    if (password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      } catch (error) {
        res.status(500).json(error);
      }
    }

    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("User has been updated");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't update another account");
  }
};

const deleteUser = async (req, res) => {
  const { id, admin } = req.user;

  if (req.params.id === id || admin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't delete another account");
  }
};

module.exports = { getUser, deleteUser, updateUser, getAllUsers };
