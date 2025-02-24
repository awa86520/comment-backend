"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import {exportCommentsToCSV  } from '../controllers/exportController';
const router = express_1.default.Router();
// Example route (Replace with actual logic)
router.get('/export', (req, res) => {
    res.send('Export route working!');
});
// router.get('/export', async (req: Request, res: Response) => {
//  await exportCommentsToCSV(req, res);
//});
//export default router;
