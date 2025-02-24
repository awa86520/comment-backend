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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportCommentsToCSV = void 0;
const commentModel_1 = require("../models/commentModel");
const csv_writer_1 = require("csv-writer");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const exportCommentsToCSV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        const comments = yield commentModel_1.Comment.find({ videoId });
        if (!comments.length) {
            return res.status(404).json({ success: false, message: 'No comments found' });
        }
        const filePath = path_1.default.join(__dirname, `../../exports/comments_${videoId}.csv`);
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: filePath,
            header: [
                { id: 'maskedUsername', title: 'Username' },
                { id: 'commentText', title: 'Comment' },
                { id: 'sentiment', title: 'Sentiment' }
            ]
        });
        yield csvWriter.writeRecords(comments);
        // Ensure file exists before sending
        if (fs_1.default.existsSync(filePath)) {
            res.download(filePath, `comments_${videoId}.csv`, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).json({ success: false, message: 'File download failed' });
                }
            });
        }
        else {
            res.status(500).json({ success: false, message: 'CSV file could not be generated' });
        }
    }
    catch (error) {
        console.error('Error in exportCommentsToCSV:', error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
    }
});
exports.exportCommentsToCSV = exportCommentsToCSV;
