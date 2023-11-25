import { connect } from "../config";
// import authHeader from "./authHeader";

const getAllPins = async () => {
  return await connect.get("/api/pin");
};

export default {
  getAllPins,
};
