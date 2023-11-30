import express from "express";
import * as SearchController from "../controllers/search.js";

const router = express.Router();

router.get("/", SearchController.getSearch);
router.get("/tags", SearchController.getAllTags);

export default router;
