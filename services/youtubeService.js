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
exports.fetchYouTubeComments = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchYouTubeComments = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${process.env.YOUTUBE_API_KEY}&maxResults=50`;
    const response = yield axios_1.default.get(url);
    return response.data.items.map((item) => ({
        username: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textDisplay
    }));
});
exports.fetchYouTubeComments = fetchYouTubeComments;
