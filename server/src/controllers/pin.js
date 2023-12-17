import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";
import { myPinService, myUserService } from "../service/index.js";
import tryCatch from "../config/tryCatch.js";

export const createAPin = tryCatch(async (req, res, next) => {
  const pinParams = req.body;
  const { id: userId } = req.user;

  if (!pinParams || !userId) {
    return next(createHttpError(400, "Invalid parameters or user"));
  }

  const user = await myUserService.getAuthUser(userId);
  if (!user) {
    return next(createHttpError(400, "Invalid user"));
  }

  const pinData = {
    userId: user._id,
    title: pinParams.title,
    description: pinParams.description,
    image: pinParams.image,
    tags: pinParams.tags,
  };

  const pin = await myPinService.createPin(pinData);
  if (!pin) {
    return next(createHttpError(500, "Failed to create pin"));
  }

  res.status(201).json({ pin, msg: "Pin created successfully" });
});

export const getAllPins = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 20;
  const pins = await myPinService.getPins(page, limit);
  if (!pins) {
    return next(createHttpError(400, `Pins not found`));
  }
  const allPins = {
    page: page + 1,
    limit,
    pins,
  };
  res.status(200).json(allPins);
});

export const getUserPins = tryCatch(async (req, res, next) => {
  const { id: userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(createHttpError(400, "Invalid user id"));
  }
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 20;
  const pins = await myPinService.getPinsByUser(userId, page, limit);
  if (!pins) {
    return next(createHttpError(400, `Pins not found`));
  }
  const userPins = {
    page: page + 1,
    limit,
    pins,
  };
  res.status(200).json(userPins);
});

export const getUserLikedPins = tryCatch(async (req, res, next) => {
  const { id: userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(createHttpError(400, "Invalid user id"));
  }
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 20;
  const pins = await myPinService.getPinsLikedByUser(userId, page, limit);
  if (!pins) {
    return next(createHttpError(400, `Pins not found`));
  }
  const likedPins = {
    page: page + 1,
    limit,
    pins,
  };
  res.status(200).json(likedPins);
});

export const randomPins = tryCatch(async (req, res) => {
  const pins = await myPinService.getRandomPins();
  if (!pins) {
    return next(createHttpError(400, `Pins not found`));
  }
  res.status(200).json(pins);
});

export const getAPin = tryCatch(async (req, res, next) => {
  const { id: pinId } = req.params;
  if (!isValidObjectId(pinId)) {
    return next(createHttpError(400, `Invalid pin id: ${pinId}`));
  }
  const pin = await myPinService.getPin(pinId);
  if (!pin) {
    return next(createHttpError(404, `Pin not found with id: ${pinId}`));
  }
  res.status(200).json(pin);
});

export const getRelatedPins = tryCatch(async (req, res, next) => {
  const { id: pinId } = req.params;
  if (!isValidObjectId(pinId)) {
    return next(createHttpError(400, `Invalid pin id: ${pinId}`));
  }
  const pin = await myPinService.getRelatedPin(pinId);
  if (!pin) {
    return next(createHttpError(404, `Pin not found with id: ${pinId}`));
  }
  res.status(200).json(pin);
});

export const updateAPin = tryCatch(async (req, res, next) => {
  const pinParams = req.body;
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, "Invalid user or pin id"));
  }
  if (!pinParams) {
    return next(createHttpError(404, "Parameters missing"));
  }
  const updatedPin = await myPinService.updatePin(pinId, pinParams);
  if (!updatedPin) {
    return next(createHttpError(404, "Could not update pin"));
  }
  if (!updatedPin.userId._id.equals(userId)) {
    return next(createHttpError(401, "You can only update your pin"));
  }
  res.status(200).json({ pin: updatedPin, msg: "Pin updated successfully" });
});

export const likeAPin = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;

  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, "Invalid user or pin id"));
  }
  const pin = await myPinService.likePin(userId, pinId);
  if (!pin) {
    return next(createHttpError(404, "Pin not found"));
  }
  if (pin.likes.includes(userId)) {
    return res.status(400).send("You already liked this pin");
  }
  return res.status(200).send("Pin liked successfully");
});

export const dislikeAPin = tryCatch(async (req, res) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, "Invalid user or pin id"));
  }
  const pin = await myPinService.getPin(pinId);
  if (!pin) {
    return next(createHttpError(404, "Pin not found"));
  }
  if (!pin.likes.includes(userId)) {
    return res.status(400).send("You already disliked this pin");
  }
  await myPinService.dislikePin(userId, pinId);
  res.status(200).send("Pin disliked successfully");
});

export const deleteAPin = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, "Invalid user or pin id"));
  }
  const user = await myUserService.getAuthUser(userId);
  if (!user) {
    return next(createHttpError(400, "Invalid user"));
  }
  const pin = await myPinService.getPin(pinId);
  if (!pin) {
    return next(createHttpError(404, "Pin not found"));
  }
  if (!pin.userId.equals(userId)) {
    return next(createHttpError(401, "You can only delete your pin"));
  }
  await myPinService.deletePin(pinId);
  res.status(200).send("Pin deleted!");
});

export const getSubbedPins = tryCatch(async (req, res) => {
  const { id: userId } = req.user;
  if (!isValidObjectId(userId)) {
    return next(createHttpError(400, "Invalid user id"));
  }
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 20;
  const user = await myUserService.getAuthUser(userId, page, limit);
  if (!user) {
    return next(createHttpError(400, "Invalid user"));
  }
  const subscribedFeeds = user.subscribedUsers;
  const pin = await myPinService.getSubbedUserPins(subscribedFeeds, userId);
  pin.flat().sort((a, b) => b.createdAt - a.createdAt);
  const pins = pin.flatMap((pin) => pin);
  const subbedPins = {
    page: page + 1,
    limit,
    pins,
  };
  res.status(200).json(subbedPins);
});
