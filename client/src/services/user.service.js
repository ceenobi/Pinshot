import { authHeader, connect } from "../config";

const signup = async (userName, email, password) => {
  return await connect.post("/api/user/signup", { userName, email, password });
};
const login = async (userName, password) => {
  return await connect.post("/api/user/login", { userName, password });
};

const authUser = async () => {
  return await connect.get("/api/user", { headers: authHeader() });
};

const getUserProfile = async (userName) => {
  return await connect.get(`/api/user/profile/${userName}`, {
    headers: authHeader(),
  });
};

const recoverPassword = async (email) => {
  return await connect.post("/api/user/verify-email/", { email });
};

const resetPassword = async (userId, token, password) => {
  return await connect.patch(`/api/user/reset-password/${userId}/${token}`, {
    password,
  });
};

const verifyUserAccount = async (userId, token) => {
  return await connect.patch(`/api/user/verify-account/${userId}/${token}`);
};

const resendVerificationLink = async (userId) => {
  return await connect.post(`/api/user/resend-token/${userId}`, userId,{
    headers: authHeader(),
  });
};

const followUser = async (pinUserId, userId) => {
  return await connect.put(`/api/user/sub/${pinUserId}`, userId, {
    headers: authHeader(),
  });
};

const unFollowUser = async (pinUserId, userId) => {
  return await connect.put(`/api/user/unsub/${pinUserId}`, userId, {
    headers: authHeader(),
  });
};

const getSubscribedUsers = async (userId) => {
  return await connect.get(`/api/user/${userId}/subbedusers`, {
    headers: authHeader(),
  });
};

const updateProfile = async (userName, email, password, profilePhoto, bio) => {
  return await connect.patch(
    "/api/user/update",
    {
      userName,
      email,
      password,
      profilePhoto,
      bio,
    },
    {
      headers: authHeader(),
    }
  );
};

const logout = async () => {
  localStorage.removeItem("usertoken");
  window.location.href = "/";
};

export default {
  signup,
  login,
  authUser,
  getUserProfile,
  followUser,
  unFollowUser,
  updateProfile,
  getSubscribedUsers,
  recoverPassword,
  resetPassword,
  verifyUserAccount,
  resendVerificationLink,
  logout,
};
