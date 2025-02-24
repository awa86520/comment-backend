"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const topWordController_1 = require("../controllers/topWordController");
const router = (0, express_1.Router)();
// Route to fetch the most frequently occurring word from comments of a specific video
router.get("/top-word/:videoId", topWordController_1.getTopWord);
exports.default = router;
