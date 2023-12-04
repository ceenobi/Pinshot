import { Schema, model } from "mongoose";

const pinSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
    },
    title: {
      type: String,
      required: true,
      max: 60,
    },
    description: {
      type: String,
      required: true,
      max: 300,
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
pinSchema.index({ title: "text", description: "text", tags: "text" });
export default model("Pin", pinSchema);
