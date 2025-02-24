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
exports.getVideoStats = void 0;
const commentModel_1 = require("../models/commentModel");
// Function to fetch month-wise comment count and sentiment analysis
const getVideoStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        // Aggregate month-wise comment count
        const monthWiseCount = yield commentModel_1.Comment.aggregate([
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
        const totalComments = yield commentModel_1.Comment.countDocuments({ videoId });
        if (totalComments === 0) {
            res.json({
                monthWiseCount: [],
                sentimentStats: { positive: "0.00%", negative: "0.00%", neutral: "0.00%" }
            });
            return;
        }
        // Aggregate sentiment percentages
        const sentimentStats = yield commentModel_1.Comment.aggregate([
            { $match: { videoId } },
            {
                $group: {
                    _id: { $toLower: "$sentiment" }, // Ensure case consistency
                    count: { $sum: 1 }
                }
            }
        ]);
        // Default sentiment percentages
        const sentimentPercentages = {
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
    }
    catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getVideoStats = getVideoStats;
