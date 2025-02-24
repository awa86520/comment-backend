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
exports.analyzeSentiment = void 0;
const axios_1 = __importDefault(require("axios"));
const analyzeSentiment = (text) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const API_KEY = process.env.GEMINI_API_KEY; // Ensure this is correctly set
        if (!API_KEY)
            throw new Error("Missing GEMINI_API_KEY in environment variables.");
        const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
        const response = yield axios_1.default.post(URL, {
            contents: [
                { parts: [{ text: `Analyze the sentiment of this text: "${text}". Return only "positive", "negative", or "neutral".` }] }
            ]
        }, { headers: { "Content-Type": "application/json" } });
        // Extract sentiment safely
        const sentiment = (_g = (_f = (_e = (_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) === null || _g === void 0 ? void 0 : _g.trim().toLowerCase();
        // Ensure only valid responses are returned
        if (["positive", "negative", "neutral"].includes(sentiment)) {
            return sentiment;
        }
        console.warn("Unexpected sentiment response:", sentiment);
        return "neutral"; // Default fallback if response is unexpected
    }
    catch (error) {
        console.error("Error in sentiment analysis:", ((_h = error === null || error === void 0 ? void 0 : error.response) === null || _h === void 0 ? void 0 : _h.data) || (error === null || error === void 0 ? void 0 : error.message) || "Unknown error");
        if (((_j = error === null || error === void 0 ? void 0 : error.response) === null || _j === void 0 ? void 0 : _j.status) === 429) {
            console.warn("Quota exceeded, defaulting to 'neutral'");
            return "neutral"; // Default when quota is exceeded
        }
        return "neutral"; // Default error handling
    }
});
exports.analyzeSentiment = analyzeSentiment;
