import ReportedPost from "../models/ReportedPost.js";

const store = async (req, res, next) => {
  const { post_id, reason } = req.body;

  try {
    const reported_post = new ReportedPost({
      post: post_id,
      reason,
    });

    await reported_post.save();

    return res.status(200).json({
      success: true,
      message: "The post has been reported",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const get = async (req, res, next) => {
  try {
    const reported_posts = await ReportedPost.find()
      .populate({
        path: "post",
        populate: [
          "liked_by",
          "comments",
          "disliked_by",
          "community",
          "added_by",
        ],
      })
      .sort({ createdAt: -1 });

    let temp = [];

    reported_posts.map((item) =>
      temp.push({
        _id: item._id,
        reason: item.reason,
        title: item.post.title,
        description: item.post.description,
        community_name: item.post.community.name,
        user_name: item.post.added_by.name,
        post_id: item.post._id,
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
    await ReportedPost.findByIdAndDelete(_id);

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
