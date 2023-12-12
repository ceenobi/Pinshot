import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";
import crypto from "crypto";
import otpGenerator from "otp-generator";
import { myUserService } from "../service/index.js";
import generateToken from "../config/generateToken.js";
import env from "../utils/validateEnv.js";
import sendEmail from "../config/mailVerify.js";
import tryCatch from "../config/tryCatch.js";

export const signUp = tryCatch(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    throw createHttpError(400, "Parameters missing");
  }
  const currentEmail = await myUserService.getUserByEmail(email);
  if (currentEmail) {
    throw createHttpError(409, "Email already registered, pls choose log in");
  }
  const currentUser = await myUserService.getUserByUsername(userName);
  if (currentUser) {
    throw createHttpError(409, "Username already taken, pls choose a new one");
  }
  if (!currentUser) {
    const user = await myUserService.addUser({ userName, email, password });
    const access_token = generateToken(user._id, user.role);
    let setToken = await myUserService.createVerifyToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    if (!setToken) {
      throw createHttpError(400, "Token not created");
    }
    const message = `${env.BASE_URL}/api/user/verify/${user.id}/${setToken.token}`;
    if (!message) {
      throw createHttpError(400, "Verification message not sent");
    }
    await sendEmail({
      userName: userName,
      from: env.USERMAIL,
      to: user.email,
      subject: "Account Verification Link",
      text: `Welcome, ${userName}, Please verify your email by clicking this link : ${message}`,
    });
    res.status(201).json({
      access_token,
      msg: "Signup success, an email was sent to your account please verify",
    });
  }
});

export const login = tryCatch(async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    throw createHttpError(400, "Fields missing");
  }
  const user = await myUserService.getUserByUsername({ userName });
  if (!user) {
    throw createHttpError(401, "Username or password is incorrect");
  }
  const passwordMatch = await myUserService.verifyPassword(
    password,
    user.password
  );
  if (!passwordMatch) {
    throw createHttpError(401, "Username or password is incorrect");
  }
  const access_token = generateToken(user._id, user.role);
  res.status(200).json({ access_token, msg: "Login success" });
});

export const getUser = tryCatch(async (req, res) => {
  const { id: userId } = req.user;

  if (!isValidObjectId(userId)) {
    throw createHttpError(400, `Invalid user id: ${userId}`);
  }
  const user = await myUserService.getAuthUser(userId);
  if (!user) {
    throw createHttpError(404, `User not found with id: ${userId}`);
  }
  res.status(200).json(user);
});

export const getProfileUser = tryCatch(async (req, res) => {
  const { userName } = req.params;
  if (!userName) {
    throw createHttpError(400, `Invalid params`);
  }
  const user = await myUserService.getUserProfile({ userName });
  if (!user) {
    throw createHttpError(404, `User not found: ${userName}`);
  }
  res.status(200).json(user);
});

export const updateUserdata = tryCatch(async (req, res) => {
  const { id: userId } = req.user;
  const { userName, email, password, profilePhoto, bio } = req.body;
  if (!isValidObjectId(userId)) {
    throw createHttpError(400, "Invalid user id");
  }
  const updatedUser = await myUserService.updateUser(userId, {
    userName,
    email,
    password,
    profilePhoto,
    bio,
  });
  if (!updatedUser._id.equals(userId)) {
    throw createHttpError(401, "You cannot access this user");
  }
  if (!updatedUser) {
    throw createHttpError(404, "User not found");
  }
  const access_token = generateToken(updatedUser._id, updatedUser.role);
  res
    .status(200)
    .json({ access_token, user: updatedUser, msg: "Updated userinfo success" });
});

export const verifyEmail = tryCatch(async (req, res, next) => {
  const { id: userId } = req.params;
  const { token: token } = req.params;

  if (!isValidObjectId(userId)) {
    throw createHttpError(400, "Invalid user id");
  }
  if (!userId) {
    throw createHttpError(401, "401,Unable to find this user");
  }
  if (!token) {
    throw createHttpError(
      400,
      "Your verification link may have expired. Please click on resend for verify your Email."
    );
  }
  const user = await myUserService.getUserById({ id: userId });
  if (!user) {
    throw createHttpError(400, "Invalid user");
  }
  if (user.isVerified) {
    return res.status(200).send("User has been already verified. Please Login");
  }
  const getToken = await myUserService.verifyToken({
    userId: user.id,
    token: token,
  });
  await myUserService.updateVerifyUserStatus(user.id);
  await myUserService.removeTokenAfterVerified(getToken.id);
  res.send("email verified sucessfully");
});

export const generateOTP = async (req, res) => {
  req.app.locals.OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).json({ code: req.app.locals.OTP });
};
export const verifyOTP = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).json({ msg: "Verified Successsfully!" });
  }
  return res.status(400).json({ error: "Invalid OTP" });
};

export const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).json({ flag: req.app.locals.resetSession });
  }
  return res.status(440).json({ error: "Session expired!" });
};

export const resetPassword = tryCatch(async (req, res) => {
  const { userName, password } = req.body;
  const user = await myUserService.getUserByUsername(userName);
  if (!user) throw createHttpError(401, "User not found");
  const updatePassword = await myUserService.passwordReset({
    userName,
    password,
  });
  req.app.locals.resetSession = false;
  return res.status(201).json({ updatePassword, msg: "Password Updated...!" });
});

export const subAUser = tryCatch(async (req, res) => {
  const { id: userId } = req.user;
  const { id: sub } = req.params;
  if (!isValidObjectId(userId)) {
    throw createHttpError(400, "Invalid user id");
  }
  if (!userId) {
    throw createHttpError(401, "Unable to find this user");
  }
  if (!sub) {
    throw createHttpError(401, "Unable to find this user");
  }
  await myUserService.subscribeUser(userId, sub);
  res.status(200).json("Following user successfull.");
});

export const unSubAUser = tryCatch(async (req, res) => {
  const { id: userId } = req.user;
  const { id: sub } = req.params;
  if (!isValidObjectId(userId)) {
    throw createHttpError(400, "Invalid user id");
  }
  if (!userId) {
    throw createHttpError(401, "401,Unable to find this user");
  }
  if (!sub) {
    throw createHttpError(401, "Unable to find this user");
  }
  await myUserService.unSubscribeUser(userId, sub);
  res.status(200).json("Unfollowed user successfull.");
});

export const getSubcribedUsers = tryCatch(async (req, res) => {
  const { id: userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(createHttpError(400, "Invalid user id"));
  }
  const user = await myUserService.getSubbedUsers(userId);
  if (!user) {
    return next(createHttpError(400, "Invalid user"));
  }
  res.status(200).json(user);
});
