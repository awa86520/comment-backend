import express from 'express';
import { Request, Response } from 'express';
import { getCommentsAndAnalyze } from '../controllers/commentController'; // ✅ Ensure correct import

const router = express.Router();

// Explicitly type request handler function
router.get('/comments', async (req: Request, res: Response) => {
    await getCommentsAndAnalyze(req, res);
});

export default router;






