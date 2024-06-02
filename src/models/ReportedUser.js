import mongoose, { Schema } from "mongoose";

const ReportedUserSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ReportedUser", ReportedUserSchema);
