import express from 'express'
import * as AuthController from '../controllers/user.js'
import { verifyAuth, Roles, localVariables } from '../middleware/authVerify.js'

const router = express.Router()

router.post('/signup', AuthController.signUp)
router.post('/login', AuthController.login)

router.patch('/reset-password', AuthController.resetPassword)

router.get('/verify/:id/:token', AuthController.verifyEmail)
router.get('/generate-otp', localVariables, AuthController.generateOTP)
router.get('/verify-otp', AuthController.verifyOTP)
router.get('/createResetSession', AuthController.createResetSession)

//middleware routes
router.patch('/update', verifyAuth(Roles.All), AuthController.updateUserdata)
router.get('/', verifyAuth(Roles.All), AuthController.getUser)
router.put('/sub/:id', verifyAuth(Roles.User), AuthController.subAUser)
router.put('/unsub/:id', verifyAuth(Roles.User), AuthController.unSubAUser)

export default router
