"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statsController_1 = require("../controllers/statsController"); // Make sure this path is correct
const router = (0, express_1.Router)();
// Route to get stats for a YouTube video
router.get("/stats/:videoId", statsController_1.getVideoStats);
exports.default = router;
