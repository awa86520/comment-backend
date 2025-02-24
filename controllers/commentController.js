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
exports.getCommentsAndAnalyze = void 0;
const youtubeService_1 = require("../services/youtubeService");
const sentimentService_1 = require("../services/sentimentService");
const commentModel_1 = require("../models/commentModel"); // ✅ Ensure this matches model export
const maskUtils_1 = require("../utils/maskUtils");
const cache_1 = require("../utils/cache");
const getCommentsAndAnalyze = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        // Check cache first
        const cachedData = (0, cache_1.getCache)(videoId);
        if (cachedData) {
            return res.json({ success: true, data: cachedData, source: 'cache' });
        }
        // Fetch comments from YouTube API
        const comments = yield (0, youtubeService_1.fetchYouTubeComments)(videoId);
        if (!comments || comments.length === 0) {
            return res.status(404).json({ success: false, message: 'No comments found' });
        }
        // Process comments and analyze sentiment
        const analyzedComments = yield Promise.all(comments.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                maskedUsername: (0, maskUtils_1.maskUsername)(comment.username),
                commentText: comment.text,
                sentiment: yield (0, sentimentService_1.analyzeSentiment)(comment.text),
                videoId
            });
        })));
        // Store in MongoDB
        yield commentModel_1.Comment.insertMany(analyzedComments);
        // Cache results
        (0, cache_1.setCache)(videoId, analyzedComments, 300);
        res.json({ success: true, data: analyzedComments, source: 'API' });
    }
    catch (error) {
        console.error('Error in getCommentsAndAnalyze:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.getCommentsAndAnalyze = getCommentsAndAnalyze;
