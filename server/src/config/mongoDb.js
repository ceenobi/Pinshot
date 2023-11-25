import mongoose from 'mongoose'
import env from '../utils/validateEnv.js'

let isConnected = false

export const connectDB = async () => {
  mongoose.set('strictQuery', true)

  if (isConnected) {
    console.log('MongoDB is already connected')
    return
  }

  try {
    await mongoose.connect(env.MONGO_URI, {
      dbName: 'Pinshot',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    isConnected = true
    console.log('MongoDB connected')
  } catch (error) {
    console.log(error)
  }
}
