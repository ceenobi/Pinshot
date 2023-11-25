import jwt from 'jsonwebtoken'
import env from '../utils/validateEnv.js'

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: '1d',
  })
}

export default generateToken
