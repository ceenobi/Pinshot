import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true, select: false },
    profilePhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/ceenobi/image/upload/v1698666381/icons/user-avatar-profile-icon-black-vector-illustration_mpn3ef.jpg",
    },
    bio: { type: String, default: "Nothing to show yet" },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: { type: String, default: "user" },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: { type: [String] },
  },
  {
    timestamps: true,
  }
);
userSchema.index({ userName: "text" });
export default model("User", userSchema);
