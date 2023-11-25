import mongoose from 'mongoose'
import { myCommentService, myUserService } from '../service/index.js'
import createHttpError from 'http-errors'
import tryCatch from '../config/tryCatch.js'

export const addAComment = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user
  const { id: pinId } = req.params
  const { comment } = req.body

  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(pinId)) {
    return next(createHttpError(400, 'Invalid user or pin id'))
  }
  if (!comment) {
    return next(createHttpError(400, 'Comment is missing'))
  }
  const user = await myUserService.getAuthUser(userId)
  if (!user) {
    return next(createHttpError(400, 'User not found'))
  }
  const comments = await myCommentService.addComment({
    userId: user._id,
    pinId: pinId,
    avatar: user.profilePhoto,
    owner: user.userName,
    comment: comment,
  })
  res.status(201).json({ comments, msg: 'Comment added successfully' })
})

export const updateAComment = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user
  const { id: commentId } = req.params
  const { comment } = req.body
  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(commentId)
  ) {
    return next(createHttpError(400, 'Invalid user or comment id'))
  }
  if (!comment) {
    return next(createHttpError(400, 'Comment is missing'))
  }
  const comments = await myCommentService.updateComment(commentId, { comment })
  if (!comments.userId.equals(userId)) {
    return next(createHttpError(401, 'You can only update your comment'))
  }
  if (!comments) {
    return next(createHttpError(404, 'Comment not found'))
  }
  res.status(200).json({ comments, msg: 'Comment updated successfully' })
})

export const getPinComments = tryCatch(async (req, res, next) => {
  const { id: pinId } = req.params
  if (!mongoose.isValidObjectId(pinId)) {
    return next(createHttpError(400, 'Invalid comment id'))
  }
  const comments = await myCommentService.getComments(pinId)
  if (!comments) {
    return next(createHttpError(400, `Comments not found`))
  }
  res.status(200).json(comments)
})

export const deleteComments = tryCatch(async (req, res, next) => {
  const { id: commentId } = req.params
  if (!mongoose.isValidObjectId(commentId)) {
    return next(createHttpError(400, 'Invalid comment id'))
  }
  const comments = await myCommentService.deleteComment(commentId)
  if (!comments) {
    return next(createHttpError(400, `Comments not found`))
  }
  res.status(200).send('comment deleted!')
})

export const likeAComment = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user
  const { id: commentId } = req.params

  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(commentId)
  ) {
    return next(createHttpError(400, 'Invalid user or comment id'))
  }
  const comment = await myCommentService.likeComment(userId, commentId)
  if (!comment) {
    throw createHttpError(404, 'Comment not found')
  }
  return res.status(200).send('Comment liked!')
})
export const dislikeAComment = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user
  const { id: commentId } = req.params

  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(commentId)
  ) {
    return next(createHttpError(400, 'Invalid user or comment id'))
  }
  const comment = await myCommentService.dislikeComment(userId, commentId)
  if (!comment) {
    throw createHttpError(404, 'Comment not found')
  }
  return res.status(200).send('Comment disliked!')
})
