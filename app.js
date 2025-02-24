"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//mport cors from 'cors';
const cors_1 = __importDefault(require("cors"));
//import * as cors from 'cors
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
//import exportRoutes from './routes/exportRoutes';
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
const commentCountRoutes_1 = __importDefault(require("./routes/commentCountRoutes"));
const getWordRoutes_1 = __importDefault(require("./routes/getWordRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use('/api', commentRoutes_1.default);
//app.use('/api', exportRoutes);
app.use('/api', statsRoutes_1.default);
app.use('/api', commentCountRoutes_1.default);
app.use('/api', getWordRoutes_1.default);
exports.default = app;
