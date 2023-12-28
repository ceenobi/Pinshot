import { authHeader, connect } from "../config";

const searchUserOrPins = async (searchQuery) => {
  return await connect.get(`/search?q=${searchQuery}`);
};
const searchPinsByTags = async (tag) => {
  return await connect.get(`/search/pin/tag?q=${tag}`);
};

const getAllTags = async () => {
  return await connect.get(`/search/tags`);
};
const deleteATag = async (pinId) => {
  return await connect.delete(`/search/${pinId}/tags`, {
    headers: authHeader(),
  });
};

export default {
  searchUserOrPins,
  getAllTags,
  searchPinsByTags,
  deleteATag,
};
