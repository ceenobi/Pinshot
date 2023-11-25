import express from 'express'
import * as PinController from '../controllers/pin.js'
import { verifyAuth, Roles } from '../middleware/authVerify.js'

const router = express.Router()

router.post('/create', verifyAuth(Roles.All), PinController.createAPin)
router.put('/like/:id', verifyAuth(Roles.All), PinController.likeAPin)
router.put('/dislike/:id', verifyAuth(Roles.All), PinController.dislikeAPin)

router.patch('/:id', verifyAuth(Roles.User), PinController.updateAPin)

router.delete('/:id', verifyAuth(Roles.All), PinController.deleteAPin)
router.get('/subscribed', verifyAuth(Roles.All), PinController.getSubbedPins)

router.get('/:id', PinController.getAPin)
router.get('/', PinController.getAllPins)
router.get('/random', PinController.randomPins)
router.get('/tags/search', PinController.getPinsByTags)
router.get('/search/query', PinController.getPinsBySearch)

export default router
