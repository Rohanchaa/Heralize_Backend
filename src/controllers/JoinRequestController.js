import mongoose from "mongoose";
import JoinRequest from "../models/JoinRequest.js";
import Community from "../models/Community.js";

const store = async (req, res) => {
  try {
    const { id } = res.locals.user;

    const { community_id } = req.body;

    const request = await JoinRequest.findOne({
      $and: [{ user: id }, { community: community_id }],
    });

    if (request) {
      return res.status(400).json({
        success: false,
        message: "You have already requested",
      });
    }

    const newRequest = new JoinRequest({
      _id: new mongoose.Types.ObjectId(),
      user: id,
      community: community_id,
    });

    await newRequest.save();

    return res.status(200).json({
      success: true,
      message: "Request to join has been sent",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const get = async (req, res) => {
  try {
    const requests = await JoinRequest.find().populate(["user", "community"]);

    let temp = [];

    requests.map((item) =>
      temp.push({
        _id: item._id,
        community_name: item.community.name,
        user_name: item.user.name,
      })
    );

    return res.status(200).json({
      success: true,
      data: temp,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await JoinRequest.findOne({ _id: id });

    await Community.findByIdAndUpdate(request.community, {
      $push: { users: request.user },
    });

    await JoinRequest.findOneAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Request accepted",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await JoinRequest.findOneAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Request declined",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const controller = { store, acceptRequest, rejectRequest, get };
export default controller;
