import express from "express";
const router = express.Router();
import upload from "../../helper/common/multerConfig.js";
import {
    addReview,
    getReviewList
} from "./controller.js";

router.post("/add-review", addReview);
router.get("/get-review-list", getReviewList);

export default router;