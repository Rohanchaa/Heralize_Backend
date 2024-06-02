import mongoose, { Schema } from "mongoose";

const ReportedPostSchema = new Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ReportedPost", ReportedPostSchema);
