"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentCounts = void 0;
const commentModel_1 = require("../models/commentModel");
// Function to count total comments and sentiment distribution for a specific videoId
const getCommentCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        // Count total number of comments for the given videoId
        const totalComments = yield commentModel_1.Comment.countDocuments({ videoId });
        if (totalComments === 0) {
            res.json({
                totalComments: 0,
                sentimentCounts: { positive: 0, negative: 0, neutral: 0 }
            });
            return;
        }
        // Aggregate count of each sentiment type for the given videoId
        const sentimentStats = yield commentModel_1.Comment.aggregate([
            { $match: { videoId } }, // Filter by videoId
            {
                $group: {
                    _id: "$sentiment",
                    count: { $sum: 1 }
                }
            }
        ]);
        // Initialize sentiment counts
        const sentimentCounts = {
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
    }
    catch (error) {
        console.error("Error fetching comment counts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getCommentCounts = getCommentCounts;
