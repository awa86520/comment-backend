import { Request, Response } from 'express';
import { fetchYouTubeComments } from '../services/youtubeService';
import { analyzeSentiment } from '../services/sentimentService';
import { Comment } from '../models/commentModel';
import { maskUsername } from '../utils/maskUtils';
import { setCache, getCache } from '../utils/cache';

// Function to extract videoId from YouTube URL
const extractVideoId = (url: string): string | null => {
    const regex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

export const getCommentsAndAnalyze = async (req: Request, res: Response) => {
    try {
        const { videoUrl } = req.body;

        if (!videoUrl) {
            return res.status(400).json({ success: false, message: 'YouTube URL is required' });
        }

        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            return res.status(400).json({ success: false, message: 'Invalid YouTube URL' });
        }

        // Check cache first
        const cachedData = getCache(videoId);
        if (cachedData) {
            return res.json({ success: true, data: cachedData, source: 'cache' });
        }

        // Fetch comments from YouTube API
        let comments;
        try {
            comments = await fetchYouTubeComments(videoId);
        } catch (apiError) {
            console.error('YouTube API Error:', apiError);
            return res.status(500).json({ success: false, message: 'Failed to fetch comments from YouTube' });
        }

        if (!comments || comments.length === 0) {
            return res.status(404).json({ success: false, message: 'No comments found' });
        }

        // Process comments and analyze sentiment
        const analyzedComments = await Promise.all(
            comments.map(async (comment: { username: string; text: string }) => {
                try {
                    return {
                        maskedUsername: maskUsername(comment.username),
                        commentText: comment.text,
                        sentiment: await analyzeSentiment(comment.text),
                        videoId
                    };
                } catch (sentimentError) {
                    console.error('Sentiment Analysis Error:', sentimentError);
                    return null; // Skip this comment if an error occurs
                }
            })
        );

        // Remove null values if sentiment analysis fails
        const validComments = analyzedComments.filter(comment => comment !== null);

        if (validComments.length === 0) {
            return res.status(500).json({ success: false, message: 'Failed to analyze comments' });
        }

        // Store in MongoDB
        try {
            await Comment.insertMany(validComments);
        } catch (dbError) {
            console.error('MongoDB Insert Error:', dbError);
            return res.status(500).json({ success: false, message: 'Database Error: Failed to store comments' });
        }

        // Cache results
        setCache(videoId, validComments, 300);

        res.json({ success: true, data: validComments, source: 'API' });
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json({ success: false, message: 'Unexpected Internal Server Error' });
    }
};





