import { Router } from "express";
import { getVideoStats } from "../controllers/statsController"; // Make sure this path is correct

const router = Router();

// Route to get stats for a YouTube video
router.get("/stats/:videoId", getVideoStats);

export default router;

