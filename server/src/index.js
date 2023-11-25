import app from './app.js'
import env from './utils/validateEnv.js'
import { connectDB } from './config/mongoDb.js'

const port = env.PORT || 6000

if (!port || !env.MONGO_URI) {
  throw new Error(
    'Please make sure that the file .env is in place and populated'
  )
}

connectDB()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`)
      })
    } catch (error) {
      console.log('Cannot connect to the server')
    }
  })
  .catch((error) => {
    console.log('Invalid database connection...!')
  })
