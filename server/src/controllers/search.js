import { isValidObjectId } from "mongoose";
import NodeCache from "node-cache";
import createHttpError from "http-errors";
import { mySearchService } from "../service/index.js";
import tryCatch from "../config/tryCatch.js";

export const getSearch = tryCatch(async (req, res, next) => {
  if (!req.query.q) {
    return next(createHttpError(400, "Search parameter is missing"));
  }
  const searchQuery =
    req.query.q.trim() || req.query.q.split(",").map((tag) => tag.trim());
  const result = await mySearchService.searchUserOrPinsOrTags(searchQuery);
  if (!result) {
    return next(createHttpError(404, "No results"));
  }
  res.status(200).json(result);
});

const cache = new NodeCache({ stdTTL: 600 });
export const getAllTags = tryCatch(async (req, res, next) => {
  const cachedTags = cache.get("tags");
  if (cachedTags) {
    return res.status(200).json(cachedTags);
  }
  const tags = await mySearchService.getTags();
  if (!tags) {
    return next(createHttpError(404, "tags not found"));
  }
  // Store the result in the cache
  cache.set("tags", tags);
  res.status(200).json(tags);
});

export const deleteTags = tryCatch(async (req, res, next) => {
  const { id: pinId } = req.params;
  if (!isValidObjectId(pinId)) {
    return next(createHttpError(400, `Invalid pin id: ${pinId}`));
  }
  await mySearchService.deleteATag(pinId);
  res.status(200).send("Tag deleted!");
});
