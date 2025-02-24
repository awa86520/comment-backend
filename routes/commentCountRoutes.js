"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getCommentCountsController_1 = require("../controllers/getCommentCountsController");
const router = (0, express_1.Router)();
// Route to get total comment count and sentiment distribution
//router.get("/comment-counts", getCommentCounts);
router.get("/comments-count/:videoId", getCommentCountsController_1.getCommentCounts);
exports.default = router;
