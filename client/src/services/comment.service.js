import { connect } from "../config";
import authHeader from "./authHeader";

const postComment = async (pinId, comment) => {
  return await connect.post(
    `/api/comment/${pinId}/add`,
    { comment },
    {
      headers: authHeader(),
    }
  );
};
const getPinComments = async (pinId) => {
  return await connect.get(`/api/comment/${pinId}`, {
    headers: authHeader(),
  });
};
const likeAComment = async (commentId, userId) => {
  return await connect.put(`/api/comment/${commentId}/like`, userId, {
    headers: authHeader(),
  });
};
const dislikeAComment = async (commentId, userId) => {
  return await connect.put(`/api/comment/${commentId}/dislike`, userId, {
    headers: authHeader(),
  });
};
const deleteAComment = async (commentId) => {
  return await connect.delete(`/api/comment/${commentId}`, {
    headers: authHeader(),
  });
};

export default {
  postComment,
  getPinComments,
  likeAComment,
  dislikeAComment,
  deleteAComment,
};
