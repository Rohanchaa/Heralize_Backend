import ReportedUser from "../models/ReportedUser.js";

const store = async (req, res, next) => {
  const { user_id, reason } = req.body;

  try {
    const reported_post = new ReportedUser({
      user: user_id,
      reason,
    });

    await reported_post.save();

    return res.status(200).json({
      success: true,
      message: "The user has been reported",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const get = async (req, res, next) => {
  try {
    const reported_users = await ReportedUser.find()
      .populate(["user"])
      .sort({ createdAt: -1 });

    let temp = [];

    reported_users.map((item) =>
      temp.push({
        _id: item._id,
        reason: item.reason,
        user_name: item.user.name,
        user_id: item.user._id,
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

const destroy = async (req, res, next) => {
  const { _id } = req.params;

  try {
    await ReportedUser.findByIdAndDelete(_id);

    return res.status(200).json({
      success: true,
      message: "Report has been deleted",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const controller = { store, get, destroy };

export default controller;
