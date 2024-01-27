import { authHeader, connect } from "../config";

const signup = async (userName, email, password) => {
  return await connect.post("/user/signup", { userName, email, password });
};
const login = async (userName, password) => {
  return await connect.post("/user/login", { userName, password });
};

const authUser = async () => {
  return await connect.get("/user", { headers: authHeader() });
};

const getUserProfile = async (userName) => {
  return await connect.get(`/user/profile/${userName}`, {
    headers: authHeader(),
  });
};

const recoverPassword = async (email) => {
  return await connect.post("/user/verify-email/", { email });
};

const resetPassword = async (userId, token, password) => {
  return await connect.patch(`/user/reset-password/${userId}/${token}`, {
    password,
  });
};

const verifyUserAccount = async (userId, token) => {
  return await connect.patch(`/user/verify-account/${userId}/${token}`);
};

const resendVerificationLink = async (userId) => {
  return await connect.post(`/user/resend-token/${userId}`, userId, {
    headers: authHeader(),
  });
};

const followUser = async (pinUserId, userId) => {
  return await connect.put(`/user/sub/${pinUserId}`, userId, {
    headers: authHeader(),
  });
};

const unFollowUser = async (pinUserId, userId) => {
  return await connect.put(`/user/unsub/${pinUserId}`, userId, {
    headers: authHeader(),
  });
};

const getSubscribedUsers = async (userId) => {
  return await connect.get(`/user/${userId}/subbedusers`, {
    headers: authHeader(),
  });
};

const updateProfile = async (userName, email, password, profilePhoto, bio) => {
  return await connect.patch(
    "/user/update",
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

const logout = () => {
  localStorage.removeItem("usertoken");
  window.location.reload();
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
