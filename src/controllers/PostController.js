import Post from "../models/Post.js";
import Community from "../models/Community.js";
import ReportedPost from "../models/ReportedPost.js";

const store = async (req, res, next) => {
  const { id } = res.locals.user;

  const { title, description, community_id } = req.body;

  try {
    const post = new Post({
      title,
      description,
      added_by: id,
      community: community_id,
    });

    await post.save();

    return res.status(200).json({
      success: true,
      message: "New post has been added",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const get = async (req, res, next) => {
  const { id } = res.locals.user;

  try {
    const communities = await Community.find({
      users: { $in: [`${id}`] },
    });

    if (communities) {
      const coummintiesId = communities.map((value) => value._id.toString());
      const posts = await Post.find()
        .populate("added_by")
        .populate("community");

      if (posts) {
        const userPosts = posts.filter((post) => {
          return coummintiesId.includes(post.community._id.toString());
        });

        let temp = [];

        userPosts.map((item) =>
          temp.push({
            _id: item._id,
            title: item.title,
            description: item.description,
            liked_by_me: item.liked_by.some(
              (item) => item._id.toString() === id
            ),
            disliked_by_me: item.disliked_by.some(
              (item) => item._id.toString() === id
            ),
            comment_count: item.comments.length,
            like_count: item.liked_by.length,
            dislike_count: item.disliked_by.length,
            editable: item.added_by?._id?.toString() === id,
            community_name: item.community.name,
            user_name: item.added_by?.name,
            user_id: item.added_by?._id,
            user_type: item.added_by?.type,
          })
        );

        return res.status(200).json({
          success: true,
          data: temp,
        });
      }
    }

    // const post = await Post.find()
    //   .populate("community")
    //   .populate({ path: "added_by" })
    //   .populate({ path: "liked_by" })
    //   .populate({ path: "disliked_by" })
    //   .select({
    //     title: 1,
    //     description: 1,
    //     _id: 1,
    //     comments: 1,
    //     liked_by: 1,
    //     disliked_by: 1,
    //     added_by: 1,
    //   })
    //   .sort({ createdAt: -1 });

    // return res.status(200).json({
    //   success: true,
    //   data: temp,
    // });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const find = async (req, res, next) => {
  const { _id } = req.params;

  const { id } = res.locals.user;

  try {
    const post = await Post.findOne({ _id })
      .populate("community")
      .populate({ path: "added_by" })
      .populate({ path: "liked_by" })
      .populate({ path: "disliked_by" })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: {
            _id: 1,
            name: 1,
          },
        },
      })
      .select({
        title: 1,
        description: 1,
        _id: 1,
        comments: 1,
        liked_by: 1,
        disliked_by: 1,
      })
      .sort({ createdAt: -1 });

    let temp = {
      _id: post._id,
      title: post.title,
      description: post.description,
      liked_by_me: post.liked_by.some((item) => item._id.toString() === id),
      disliked_by_me: post.disliked_by.some(
        (item) => item._id.toString() === id
      ),
      comment_count: post.comments.length,
      like_count: post.liked_by.length,
      dislike_count: post.disliked_by.length,
      editable: post.added_by?._id?.toString() === id,
      community_name: post.community.name,
      user_name: post.added_by?.name,
      user_id: post.added_by?._id,
      user_type: post.added_by?.type,
      comments: post.comments,
    };

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

const getByCommunity = async (req, res, next) => {
  const { _id } = req.params;

  const { id } = res.locals.user;

  try {
    const post = await Post.find({ community: _id })
      .populate("community")
      .populate({ path: "added_by" })
      .populate({ path: "liked_by" })
      .populate({ path: "disliked_by" })
      .select({
        title: 1,
        description: 1,
        _id: 1,
        comments: 1,
        liked_by: 1,
        disliked_by: 1,
        added_by: 1,
      })
      .sort({ createdAt: -1 });

    let temp = [];

    post.map((item) =>
      temp.push({
        _id: item._id,
        title: item.title,
        description: item.description,
        liked_by_me: item.liked_by.some((item) => item._id.toString() === id),
        disliked_by_me: item.disliked_by.some(
          (item) => item._id.toString() === id
        ),
        comment_count: item.comments.length,
        like_count: item.liked_by.length,
        dislike_count: item.disliked_by.length,
        editable: item.added_by?._id?.toString() === id,
        community_name: item.community.name,
        user_name: item.added_by?.name,
        user_id: item.added_by?._id,
        user_type: item.added_by?.type,
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

const likePost = async (req, res, next) => {
  const { _id } = req.body;

  const { id } = res.locals.user;

  try {
    const post = await Post.findOne({
      $and: [{ _id }, { liked_by: { $in: [id] } }],
    });

    if (post) {
      await Post.updateOne({ _id }, { $pull: { liked_by: id } });
    } else {
      await Post.updateOne({ _id }, { $push: { liked_by: id } });
    }

    await Post.updateOne({ _id }, { $pull: { disliked_by: id } });

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const dislikePost = async (req, res, next) => {
  const { _id } = req.body;

  const { id } = res.locals.user;

  try {
    const post = await Post.findOne({
      $and: [{ _id }, { disliked_by: { $in: [id] } }],
    });

    if (post) {
      await Post.updateOne({ _id }, { $pull: { disliked_by: id } });
    } else {
      await Post.updateOne({ _id }, { $push: { disliked_by: id } });
    }

    console.log("after");

    await Post.updateOne({ _id }, { $pull: { liked_by: id } });

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const addComment = async (req, res, next) => {
  const { _id, comment } = req.body;

  const { id } = res.locals.user;

  try {
    await Post.findByIdAndUpdate(_id, {
      $push: { comments: { comment, user: id } },
    });

    return res.status(200).json({
      success: true,
      message: "Comment has been added",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const deleteComment = async (req, res, next) => {
  const { _id } = req.params;

  try {
    const post = await Post.findOne({ "comments._id": { $in: [_id] } });

    if (post) {
      await Post.updateOne(
        { _id: post._id },
        { $pull: { comments: { _id: _id } } }
      );

      return res.status(200).json({
        success: true,
        message: "Comment has been deleted",
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

const update = async (req, res, next) => {
  const { _id } = req.params;

  const { title, description } = req.body;

  try {
    await Post.updateOne({ _id }, { title, description });

    return res.status(200).json({
      success: true,
      message: "Post has been updated",
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
    await ReportedPost.deleteMany({ post: _id });

    await Post.deleteOne({ _id });

    return res.status(200).json({
      success: true,
      message: "Post has been deleted",
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
  getByCommunity,
  likePost,
  dislikePost,
  addComment,
  find,
  deleteComment,
  update,
  destroy,
};

export default controller;
