"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    maskedUsername: { type: String, required: true },
    commentText: { type: String, required: true },
    sentiment: { type: String, enum: ["positive", "negative", "neutral"], required: true },
    videoId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
exports.Comment = mongoose_1.default.model('Comment', commentSchema);
