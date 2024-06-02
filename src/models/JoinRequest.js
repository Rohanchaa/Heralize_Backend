import mongoose, { Schema } from "mongoose";

const JointRequestSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    community: {
      type: mongoose.Types.ObjectId,
      ref: "Community",
    },
  },
  { timestamps: true }
);

export default mongoose.model("JoinRequest", JointRequestSchema);
