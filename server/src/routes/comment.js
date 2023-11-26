import express from 'express'
import * as CommentController from '../controllers/comment.js'
import { verifyAuth, Roles } from '../middleware/authVerify.js'

const router = express.Router()

router.post('/:id/add', verifyAuth(Roles.All), CommentController.addAComment)

router.put('/:id/like', verifyAuth(Roles.All), CommentController.likeAComment)
router.put('/:id/dislike', verifyAuth(Roles.All), CommentController.dislikeAComment)

router.patch('/:id', verifyAuth(Roles.All), CommentController.updateAComment)

router.get('/:id', CommentController.getPinComments)

router.delete('/:id', verifyAuth(Roles.User), CommentController.deleteComments)

export default router
