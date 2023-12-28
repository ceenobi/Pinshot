import { authHeader, connect } from "../config";

const getAllPins = async (page = 1) => {
  return await connect.get(`/pin?page=${page}`);
};

const getExplorePins = async (page = 1) => {
  return await connect.get(`/pin/random/explore?page=${page}`);
};

const getSubscribedPins = async (page = 1) => {
  return await connect.get(`/pin/subscribed?page=${page}`, {
    headers: authHeader(),
  });
};

const getAPin = async (pinId) => {
  return await connect.get(`/pin/${pinId}`);
};

const getRelatedPins = async (pinId) => {
  return await connect.get(`/pin/${pinId}/related`);
};

const getPinsByUser = async (userId) => {
  return await connect.get(`/pin/${userId}/userpins`, {
    headers: authHeader(),
  });
};

const getPinsLikedByUser = async (userId) => {
  return await connect.get(`/pin/${userId}/likedpins`, {
    headers: authHeader(),
  });
};

const likeAPin = async (pinId, userId) => {
  return await connect.put(`/pin/like/${pinId}`, userId, {
    headers: authHeader(),
  });
};
const dislikeAPin = async (pinId, userId) => {
  return await connect.put(`/pin/dislike/${pinId}`, userId, {
    headers: authHeader(),
  });
};

const createAPin = async (title, description, image, tags) => {
  return await connect.post(
    `/pin/create`,
    { title, description, image, tags },
    {
      headers: authHeader(),
    }
  );
};

const updateAPin = async (pinId, title, description, image, tags) => {
  return await connect.patch(
    `/pin/${pinId}`,
    { title, description, image, tags },
    {
      headers: authHeader(),
    }
  );
};

const deleteAPin = async (pinId) => {
  return await connect.delete(`/pin/${pinId}`, {
    headers: authHeader(),
  });
};

export default {
  getAllPins,
  getExplorePins,
  getAPin,
  getRelatedPins,
  likeAPin,
  dislikeAPin,
  getPinsByUser,
  createAPin,
  updateAPin,
  getPinsLikedByUser,
  getSubscribedPins,
  deleteAPin,
};
