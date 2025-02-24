import { Request, Response } from "express";
import { Comment } from "../models/commentModel";

export const getTopWord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { videoId } = req.params;

        // Fetch all comments for the given video ID
        const comments = await Comment.find({ videoId }, "commentText");

        if (comments.length === 0) {
            res.json({ topWord: null, message: "No comments found for this video." });
            return;
        }

        // Concatenate all comments into a single string
        const allText = comments.map(comment => comment.commentText.toLowerCase()).join(" ");

        // Extract words using regex
        const words = allText.match(/\b[a-zA-Z0-9']+\b/g) || [];

        if (words.length === 0) {
            res.json({ topWord: null, message: "No words found in comments." });
            return;
        }

        // Find the most frequent word using JavaScript's built-in functions
        const topWord = words.reduce((a, b, i, arr) =>
            arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
        );

        res.json({ topWord });
    } catch (error) {
        console.error("Error fetching top word:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
