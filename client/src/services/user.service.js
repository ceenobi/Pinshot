import { connect } from "../config";
import authHeader from "./authHeader";

const signup = async (userName, email, password) => {
  return await connect.post("/api/user/signup", { userName, email, password });
};
const login = async (userName, password) => {
  return await connect.post("/api/user/login", { userName, password });
};

const authUser = async () => {
  return await connect.get("/api/user", { headers: authHeader() });
};

const logout = async () => {
  localStorage.removeItem("usertoken");
  window.location.href = "/";
};

export default {
  signup,
  login,
  authUser,
  logout,
};
