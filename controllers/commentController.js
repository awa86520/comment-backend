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
const commentModel_1 = require("../models/commentModel");
const maskUtils_1 = require("../utils/maskUtils");
const cache_1 = require("../utils/cache");
// Function to extract videoId from YouTube URL
const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};
const getCommentsAndAnalyze = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
       
        const videoUrl = req.query.videoUrl ;
        if (!videoUrl) {
            return res.status(400).json({ success: false, message: 'YouTube URL is required' });
        }
        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            return res.status(400).json({ success: false, message: 'Invalid YouTube URL' });
        }
        // Check cache first
        const cachedData = (0, cache_1.getCache)(videoId);
        if (cachedData) {
            return res.json({ success: true, data: cachedData, source: 'cache' });
        }
        // Fetch comments from YouTube API
        let comments;
        try {
            comments = yield (0, youtubeService_1.fetchYouTubeComments)(videoId);
        }
        catch (apiError) {
            console.error('YouTube API Error:', apiError);
            return res.status(500).json({ success: false, message: 'Failed to fetch comments from YouTube' });
        }
        if (!comments || comments.length === 0) {
            return res.status(404).json({ success: false, message: 'No comments found' });
        }
        // Process comments and analyze sentiment
        const analyzedComments = yield Promise.all(comments.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                return {
                    maskedUsername: (0, maskUtils_1.maskUsername)(comment.username),
                    commentText: comment.text,
                    sentiment: yield (0, sentimentService_1.analyzeSentiment)(comment.text),
                    videoId
                };
            }
            catch (sentimentError) {
                console.error('Sentiment Analysis Error:', sentimentError);
                return null; // Skip this comment if an error occurs
            }
        })));
        // Remove null values if sentiment analysis fails
        const validComments = analyzedComments.filter(comment => comment !== null);
        if (validComments.length === 0) {
            return res.status(500).json({ success: false, message: 'Failed to analyze comments' });
        }
        // Store in MongoDB
        try {
            yield commentModel_1.Comment.insertMany(validComments);
        }
        catch (dbError) {
            console.error('MongoDB Insert Error:', dbError);
            return res.status(500).json({ success: false, message: 'Database Error: Failed to store comments' });
        }
        // Cache results
        (0, cache_1.setCache)(videoId, validComments, 300);
        res.json({ success: true, data: validComments, source: 'API' });
    }
    catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json({ success: false, message: 'Unexpected Internal Server Error' });
    }
});
exports.getCommentsAndAnalyze = getCommentsAndAnalyze;
