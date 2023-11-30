import { connect } from "../config";

const searchUserOrPins = async (searchQuery) => {
  return await connect.get(`/api/search?q=${searchQuery}`);
};
const searchPinsByTags = async (tag) => {
  return await connect.get(`/api/search/pin/tag?q=${tag}`);
};

const getAllTags = async () => {
  return await connect.get(`/api/search/tags`);
};

export default {
  searchUserOrPins,
  getAllTags,
  searchPinsByTags,
};
