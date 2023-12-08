import express from "express";
import * as SearchController from "../controllers/search.js";
import { verifyAuth, Roles } from "../middleware/authVerify.js";

const router = express.Router();

router.get("/", SearchController.getSearch);
router.get("/tags", SearchController.getAllTags);
router.delete("/:id/tags", verifyAuth(Roles.All), SearchController.deleteTags);

export default router;
