import { Request, Response } from "express";
import { Comment } from "../models/commentModel";

// Function to fetch month-wise comment count and sentiment analysis
export const getVideoStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const { videoId } = req.params;

        // Aggregate month-wise comment count
        const monthWiseCount = await Comment.aggregate([
            { $match: { videoId } },
            {
                $group: {
                    _id: {
                        year: { $year: "$timestamp" },
                        month: { $month: "$timestamp" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Total comment count
        const totalComments = await Comment.countDocuments({ videoId });

        if (totalComments === 0) {
            res.json({
                monthWiseCount: [],
                sentimentStats: { positive: "0.00%", negative: "0.00%", neutral: "0.00%" }
            });
            return;
        }

        // Aggregate sentiment percentages
        const sentimentStats = await Comment.aggregate([
            { $match: { videoId } },
            {
                $group: {
                    _id: { $toLower: "$sentiment" }, // Ensure case consistency
                    count: { $sum: 1 }
                }
            }
        ]);

        // Default sentiment percentages
        const sentimentPercentages: Record<string, string> = {
            positive: "0.00%",
            negative: "0.00%",
            neutral: "0.00%"
        };

        // Update values based on aggregation result
        sentimentStats.forEach(({ _id, count }) => {
            if (_id in sentimentPercentages) {
                sentimentPercentages[_id] = ((count / totalComments) * 100).toFixed(2) + "%";
            }
        });

        res.json({ monthWiseCount, sentimentStats: sentimentPercentages });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

