import { Request, Response } from "express";
import { Comment } from "../models/commentModel";

// Function to count total comments and sentiment distribution for a specific videoId
export const getCommentCounts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { videoId } = req.params;

        // Count total number of comments for the given videoId
        const totalComments = await Comment.countDocuments({ videoId });

        if (totalComments === 0) {
            res.json({
                totalComments: 0,
                sentimentCounts: { positive: 0, negative: 0, neutral: 0 }
            });
            return;
        }

        // Aggregate count of each sentiment type for the given videoId
        const sentimentStats = await Comment.aggregate([
            { $match: { videoId } }, // Filter by videoId
            {
                $group: {
                    _id: "$sentiment",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Initialize sentiment counts
        const sentimentCounts: Record<string, number> = {
            positive: 0,
            negative: 0,
            neutral: 0
        };

        // Map aggregation result to sentimentCounts
        sentimentStats.forEach(({ _id, count }) => {
            if (_id in sentimentCounts) {
                sentimentCounts[_id] = count;
            }
        });

        res.json({ totalComments, sentimentCounts });
    } catch (error) {
        console.error("Error fetching comment counts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

