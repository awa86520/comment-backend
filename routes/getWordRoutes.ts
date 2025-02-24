import { Router } from "express";
import { getTopWord } from "../controllers/topWordController";

const router = Router();

// Route to fetch the most frequently occurring word from comments of a specific video
router.get("/top-word/:videoId", getTopWord);

export default router;
