import { connect } from "../config";
import authHeader from "./authHeader";

const searchUserOrPins = async (searchQuery) => {
  return await connect.get(`/api/search?q=${searchQuery}`);
};
const searchPinsByTags = async (tag) => {
  return await connect.get(`/api/search/pin/tag?q=${tag}`);
};

const getAllTags = async () => {
  return await connect.get(`/api/search/tags`);
};
const deleteATag = async (pinId) => {
  return await connect.delete(`/api/search/${pinId}/tags`, {
    headers: authHeader(),
  });
};

export default {
  searchUserOrPins,
  getAllTags,
  searchPinsByTags,
  deleteATag,
};
