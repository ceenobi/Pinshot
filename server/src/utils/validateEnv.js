import { cleanEnv } from 'envalid'
import { str, port } from 'envalid/dist/validators.js'

export default cleanEnv(process.env, {
  MONGO_URI: str(),
  PORT: port(),
  ACCESS_TOKEN_PRIVATE_KEY: str(),
  REFRESH_TOKEN_PRIVATE_KEY: str(),
  CLIENT_URL: str(),
  BASE_URL: str(),
  HOST: str(),
  USERMAIL: str(),
  PASS: str(),
  SERVICE: str(),
  CLOUDINARY_URL: str(),
})
