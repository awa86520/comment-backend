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
exports.getTopWord = void 0;
const commentModel_1 = require("../models/commentModel");
const getTopWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        // Fetch all comments for the given video ID
        const comments = yield commentModel_1.Comment.find({ videoId }, "commentText");
        if (comments.length === 0) {
            res.json({ topWord: null, message: "No comments found for this video." });
            return;
        }
        // Concatenate all comments into a single string
        const allText = comments.map(comment => comment.commentText.toLowerCase()).join(" ");
        // Extract words using regex
        const words = allText.match(/\b[a-zA-Z0-9']+\b/g) || [];
        if (words.length === 0) {
            res.json({ topWord: null, message: "No words found in comments." });
            return;
        }
        // Find the most frequent word using JavaScript's built-in functions
        const topWord = words.reduce((a, b, i, arr) => arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b);
        res.json({ topWord });
    }
    catch (error) {
        console.error("Error fetching top word:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getTopWord = getTopWord;
