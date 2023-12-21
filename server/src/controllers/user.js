import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";
import crypto from "crypto";
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
    const message = `${env.BASE_URL}/verify-account/${user._id}/${setToken.token}`;
    if (!message) {
      throw createHttpError(400, "Verification message not sent");
    }
    await sendEmail({
      userName: userName,
      from: env.USERMAIL,
      to: user.email,
      subject: "Account Verification Link",
      text: `Welcome, ${userName}, Please verify your email by clicking this link : ${message}. Link expires in 30mins`,
    });
    res.status(201).json({
      access_token,
      msg: "Signup success, an email was sent to your account please verify",
    });
  }
});

export const sendVerificationLink = tryCatch(async (req, res, next) => {
  const { id: userId } = req.params;
  if (!userId) {
    throw createHttpError(400, `Invalid userId`);
  }
  const user = await myUserService.getUserById({ id: userId });
  if (!user) {
    throw createHttpError(400, "Invalid user");
  }
  const token = crypto.randomBytes(32).toString("hex");
  const setToken = await myUserService.createVerifyToken({
    userId: user._id,
    token: token,
  });
  if (!setToken) {
    return next(createHttpError(400, "Token not created"));
  }
  const message = `${env.BASE_URL}/verify-account/${user._id}/${setToken.token}`;

  const feedback = await sendEmail({
    userName: user.userName,
    from: env.USERMAIL,
    to: user.email,
    subject: "Account Verification Link",
    text: `Hi, ${user.userName}, Please verify your email by clicking this link : ${message}. Link expires in 30mins`,
  });
  if (!feedback) {
    throw createHttpError(400, "Verification message not sent");
  }
  res.status(200).json({ msg: "Verification link sent!" });
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

export const authenticateUser = tryCatch(async (req, res) => {
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

export const verifyAccount = tryCatch(async (req, res, next) => {
  const { id: userId, token: token } = req.params;

  if (!isValidObjectId(userId)) {
    throw createHttpError(400, "Invalid user id");
  }
  if (!userId || !token) {
    return next(createHttpError(401, "Invalid params, token may be broken"));
  }
  const user = await myUserService.getUserById({ id: userId });
  if (!user) {
    throw createHttpError(400, "Invalid user");
  }
  if (user.isVerified) {
    return res.status(401).send("User has been already verified.");
  }
  const getToken = await myUserService.verifyToken({ userId, token });
  if (!getToken) {
    return next(createHttpError(401, "Invalid or expired token"));
  } else {
    await myUserService.updateVerifyUserStatus(user._id);
    res.status(200).send("Account verified sucessfully");
  }
});

export const recoverPasswordLink = tryCatch(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw createHttpError(400, `Invalid params`);
  }
  const user = await myUserService.getUserByEmail({ email });
  if (!user) {
    return next(createHttpError(404, `Email not found: ${email}`));
  }
  const token = crypto.randomBytes(32).toString("hex");
  const setToken = await myUserService.createVerifyToken({
    userId: user._id,
    token: token,
  });
  if (!setToken) {
    return next(createHttpError(400, "Token not created"));
  }
  const message = `${env.BASE_URL}/reset-password/${user._id}/${token}`;
  await sendEmail({
    userName: user.userName,
    from: env.USERMAIL,
    to: user.email,
    subject: "Password recovery Link",
    text: `Hi, ${user.userName}, click on the link to recover your password: ${message}. Link expires in 30mins.`,
  });
  res.status(200).send("Recover password link sent to your email");
});

export const resetUserPassword = tryCatch(async (req, res, next) => {
  const { id: userId, token: token } = req.params;
  const { password } = req.body;
  if (!isValidObjectId(userId)) {
    return next(createHttpError(400, "Invalid user id"));
  }
  if (!password || !token) {
    return next(createHttpError(401, "Password or token missing"));
  }
  const user = await myUserService.getUserById({ id: userId });
  if (!user) {
    return next(createHttpError(404, "User not found"));
  }
  const getToken = await myUserService.verifyToken({ userId, token });
  if (!getToken) {
    return next(createHttpError(401, "Invalid or expired token"));
  } else {
    await myUserService.passwordReset(userId, { password });
    res.status(200).send("Password Updated...!");
  }
});

export const subAUser = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: sub } = req.params;
  if (!isValidObjectId(userId)) {
    throw createHttpError(400, "Invalid user id");
  }
  if (!userId) {
    return next(createHttpError(401, "Unable to find this user"));
  }
  if (!sub) {
    return next(createHttpError(401, "Unable to find this user"));
  }
  await myUserService.subscribeUser(userId, sub);
  res.status(200).json("Following user successfull.");
});

export const unSubAUser = tryCatch(async (req, res) => {
  const { id: userId } = req.user;
  const { id: sub } = req.params;
  if (!isValidObjectId(userId)) {
    return next(createHttpError(400, "Invalid user id"));
  }
  if (!userId) {
    return next(createHttpError(401, "401,Unable to find this user"));
  }
  if (!sub) {
    return next(createHttpError(401, "Unable to find this user"));
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
