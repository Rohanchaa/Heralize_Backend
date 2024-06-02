import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    community: {
      type: mongoose.Types.ObjectId,
      ref: "Community",
    },
    added_by: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    comments: [CommentSchema],
    liked_by: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    disliked_by: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
