import { Router } from "express";
import { getCommentCounts } from "../controllers/getCommentCountsController";

const router = Router();

// Route to get total comment count and sentiment distribution
//router.get("/comment-counts", getCommentCounts);
router.get("/comments-count/:videoId", getCommentCounts);
export default router;
