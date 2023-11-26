import { connect } from "../config";
import authHeader from "./authHeader";

const getAllPins = async () => {
  return await connect.get("/api/pin");
};
const getAPin = async (pinId) => {
  return await connect.get(`/api/pin/${pinId}`);
};
const likeAPin = async (pinId, userId) => {
  return await connect.put(`/api/pin/like/${pinId}`, userId, {
    headers: authHeader(),
  });
};
const dislikeAPin = async (pinId, userId) => {
  return await connect.put(`/api/pin/dislike/${pinId}`, userId, {
    headers: authHeader(),
  });
};

export default {
  getAllPins,
  getAPin,
  likeAPin,
  dislikeAPin,
};
