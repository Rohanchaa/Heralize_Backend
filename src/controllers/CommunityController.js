import Community from "../models/Community.js";
import CommunityRequest from "../models/CommunityRequest.js";

const store = async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const community = new Community({
      name,
      description,
    });

    await community.save();

    return res.status(200).json({
      success: true,
      message: "Community has been created",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const storeCommunityRequest = async (req, res, next) => {
  console.log("res");
  const { name, description } = req.body;

  try {
    const community = new CommunityRequest({
      name,
      description,
      user: res.locals.user.id,
    });

    await community.save();

    return res.status(200).json({
      success: true,
      message: "Request Community has been created",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};
const getCommunityRequest = async (req, res, next) => {
  try {
    const community = await CommunityRequest.find()
      .select({
        name: 1,
        user: 1,
        _id: 1,
      })
      .populate("user");

    return res.status(200).json({
      success: true,
      data: community,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const get = async (req, res, next) => {
  try {
    const community = await Community.find().select({
      name: 1,
      _id: 1,
    });

    return res.status(200).json({
      success: true,
      data: community,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const find = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { id } = res.locals.user;

    const community = await Community.findOne({ _id });

    const user_count = community.users.length;
    const is_joined = community.users.some((user) => user.equals(id));

    return res.status(200).json({
      success: true,
      data: {
        name: community.name,
        description: community.description,
        _id,
        user_count,
        is_joined,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const joinCommunity = async (req, res, next) => {
  const { id } = res.locals.user;

  const { _id } = req.params;

  try {
    const community = await Community.findOne({
      $and: [{ users: { $in: [id] } }, { _id }],
    });

    if (community) {
      return res.status(400).json({
        errors: {
          message: "You have already joined this community",
        },
      });
    }

    await Community.updateOne({ _id }, { $push: { users: id } });

    return res.status(200).json({
      success: true,
      message: "Community has been joined",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const leaveCommunity = async (req, res, next) => {
  const { id } = res.locals.user;

  const { _id } = req.params;

  try {
    const community = await Community.findOne({
      $and: [{ _id }, { users: { $in: [id] } }],
    });

    if (community) {
      await Community.updateOne({ _id }, { $pull: { users: id } });

      return res.status(200).json({
        success: true,
        message: "You have left the community",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Cannot leave group you ain't the part of.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const getMyCommunities = async (req, res, next) => {
  try {
    const { id } = res.locals.user;

    const communities = await Community.find({ users: { $in: [id] } }).select({
      _id: 1,
      name: 1,
      description: 1,
    });

    return res.status(200).json({
      success: true,
      data: communities,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const controller = {
  store,
  get,
  joinCommunity,
  find,
  leaveCommunity,
  getMyCommunities,
  storeCommunityRequest,
  getCommunityRequest,
};

export default controller;
