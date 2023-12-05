const addComment =
  (Comment) =>
  async ({ userId, pinId, avatar, owner, comment }) => {
    const newComment = new Comment({
      userId,
      pinId,
      avatar,
      owner,
      comment,
    });
    return newComment.save();
  };

const updateComment =
  (Comment) =>
  async (commentId, { comment }) => {
    const existingComment = await Comment.findById(commentId);
    existingComment.comment = comment || existingComment.comment;
    return await existingComment.save();
  };

const getComments = (Comment) => async (pinId) => {
  return await Comment.find({ pinId: pinId })
    .populate("userId", "userName profilePhoto")
    .sort({ _id: -1 });
};
const deleteComment = (Comment) => async (commentId) => {
  return await Comment.findByIdAndDelete(commentId);
};

const likeComment = (Comment) => async (userId, commentId) => {
  return await Comment.findByIdAndUpdate(commentId, {
    $addToSet: { likes: userId },
    $inc: { likeCount: 1 },
  });
};
const dislikeComment = (Comment) => async (userId, commentId) => {
  return await Comment.findByIdAndUpdate(commentId, {
    $pull: { likes: userId },
    $inc: { likeCount: -1 },
  });
};
// const replyComment =
//   (Comment) =>
//   async ({ userId, pinId, commentId }) => {
//     return await Comment.findByIdAndUpdate(commentId, {
//       $pull: { likes: userId },
//       $inc: { likeCount: -1 },
//     })
//   }

export default (Comment) => {
  return {
    addComment: addComment(Comment),
    getComments: getComments(Comment),
    deleteComment: deleteComment(Comment),
    likeComment: likeComment(Comment),
    dislikeComment: dislikeComment(Comment),
    updateComment: updateComment(Comment),
  };
};
