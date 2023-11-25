import { Schema, model } from 'mongoose'

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 5 * 86400,
    },
  },
  {
    timestamps: true,
  }
)
export default model('Token', tokenSchema)
