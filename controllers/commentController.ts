import { Request, Response } from 'express';
import { fetchYouTubeComments } from '../services/youtubeService';
import { analyzeSentiment } from '../services/sentimentService';
import { Comment } from '../models/commentModel'; // ✅ Ensure this matches model export
import { maskUsername } from '../utils/maskUtils';
import { setCache, getCache } from '../utils/cache';

export const getCommentsAndAnalyze = async (req: Request, res: Response) => {
    try {
        const { videoId } = req.params;

        // Check cache first
        const cachedData = getCache(videoId);
        if (cachedData) {
            return res.json({ success: true, data: cachedData, source: 'cache' });
        }

        // Fetch comments from YouTube API
        const comments = await fetchYouTubeComments(videoId);

        if (!comments || comments.length === 0) {
            return res.status(404).json({ success: false, message: 'No comments found' });
        }

        // Process comments and analyze sentiment
        const analyzedComments = await Promise.all(
            comments.map(async (comment: { username: string; text: string }) => ({
                maskedUsername: maskUsername(comment.username),
                commentText: comment.text,
                sentiment: await analyzeSentiment(comment.text),
                videoId
            }))
        );

        // Store in MongoDB
        await Comment.insertMany(analyzedComments);

        // Cache results
        setCache(videoId, analyzedComments, 300);

        res.json({ success: true, data: analyzedComments, source: 'API' });
    } catch (error) {
        console.error('Error in getCommentsAndAnalyze:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



