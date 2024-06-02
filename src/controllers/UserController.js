import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import jsonwebtoken from "jsonwebtoken";
import config from "../config/index.js";
import ReportedUser from "../models/ReportedUser.js";
import Post from "../models/Post.js";
import Community from "../models/Community.js";

const register = async (req, res) => {
  const { name, email, contact_number, gender, password, type } = req.body;

  try {
    bcryptjs.hash(password, 10, async (err, hash) => {
      const user = new User({
        name,
        email,
        contact_number,
        gender,
        password: hash,
        type,
      });

      await user.save();

      return res.status(200).json({
        success: true,
        message: "User has been created",
      });
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select({
    password: 1,
    name: 1,
    type: 1,
    email: 1,
    _id: 1,
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const verified = await bcryptjs.compare(password, user.password);

  if (!verified) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  jsonwebtoken.sign(
    { id: user._id, name: user.name, email: user.email, type: user.type },
    user.type === "admin" ? config.token.adminSecret : config.token.userSecret,
    {},
    (error, encoded) => {
      if (error) {
        console.error("Error during token signing:", error);
        return res.status(401).json({
          message: "Token signing failed",
          error: error,
        });
      }

      if (encoded) {
        return res.status(200).json({
          success: true,
          token: encoded,
          data: user,
        });
      }

      // Handle the case where encoded is undefined for some reason
      return res.status(401).json({
        message: "Token encoding failed",
      });
    }
  );
};

const updatePassword = async (req, res, next) => {
  const { id } = res.locals.user;

  const { password } = req.body;

  try {
    bcryptjs.hash(password, 10, async (err, hash) => {
      await User.updateOne({ _id: id }, { password: hash });

      return res.status(200).json({
        success: true,
        messasge: "Password updated",
      });
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const destroy = async (req, res, next) => {
  const { _id } = req.params;

  try {
    await ReportedUser.deleteMany({ user: _id });

    await Post.deleteMany({ added_by: _id });

    await Community.updateMany({}, { $pull: { users: { _id } } });

    await User.deleteOne({ _id });

    return res.status(200).json({
      success: true,
      message: "User has been deleted",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const controller = { register, login, updatePassword, destroy };

export default controller;
