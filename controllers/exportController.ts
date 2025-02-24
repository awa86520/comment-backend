import { Request, Response } from 'express';
import { Comment } from '../models/commentModel';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';

export const exportCommentsToCSV = async (req: Request, res: Response) => {
    try {
        const { videoId } = req.params;
        const comments = await Comment.find({ videoId });

        if (!comments.length) {
            return res.status(404).json({ success: false, message: 'No comments found' });
        }

        const filePath = path.join(__dirname, `../../exports/comments_${videoId}.csv`);

        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'maskedUsername', title: 'Username' },
                { id: 'commentText', title: 'Comment' },
                { id: 'sentiment', title: 'Sentiment' }
            ]
        });

        await csvWriter.writeRecords(comments);

        // Ensure file exists before sending
        if (fs.existsSync(filePath)) {
            res.download(filePath, `comments_${videoId}.csv`, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).json({ success: false, message: 'File download failed' });
                }
            });
        } else {
            res.status(500).json({ success: false, message: 'CSV file could not be generated' });
        }
    } catch (error) {
        console.error('Error in exportCommentsToCSV:', error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
    }
};

