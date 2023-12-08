import { connect } from "../config";
import authHeader from "./authHeader";

const getAllPins = async () => {
  return await connect.get("/api/pin");
};
const getAPin = async (pinId) => {
  return await connect.get(`/api/pin/${pinId}`);
};
const getRelatedPins = async (pinId) => {
  return await connect.get(`/api/pin/${pinId}/related`);
};
const getPinsByUser = async (userId) => {
  return await connect.get(`/api/pin/${userId}/yourpins`, {
    headers: authHeader(),
  });
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
const createAPin = async (title, description, image, tags) => {
  return await connect.post(
    `/api/pin/create`,
    { title, description, image, tags },
    {
      headers: authHeader(),
    }
  );
};
const updateAPin = async (pinId, title, description, image, tags) => {
  return await connect.patch(
    `/api/pin/${pinId}`,
    { title, description, image, tags },
    {
      headers: authHeader(),
    }
  );
};

export default {
  getAllPins,
  getAPin,
  getRelatedPins,
  likeAPin,
  dislikeAPin,
  getPinsByUser,
  createAPin,
  updateAPin,
};
