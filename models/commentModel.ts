import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    maskedUsername: {type: String, required:true},
    commentText: {type:String , required:true},
    sentiment: { type: String, enum: ["positive", "negative", "neutral"], required: true },
    videoId:  { type:String , required:true},
    timestamp: { type: Date, default: Date.now }
});

export const Comment = mongoose.model('Comment', commentSchema);


