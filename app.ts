import express from 'express';
//mport cors from 'cors';
import cors from 'cors';
//import * as cors from 'cors
import helmet from 'helmet';
import morgan from 'morgan';
import commentRoutes from './routes/commentRoutes';
//import exportRoutes from './routes/exportRoutes';
import statsRoutes from './routes/statsRoutes';
import commentCountRoutes from './routes/commentCountRoutes';
import getWordRoutes from './routes/getWordRoutes';
const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', commentRoutes);
//app.use('/api', exportRoutes);
 app.use('/api',statsRoutes);
  app.use('/api',commentCountRoutes);
  app.use('/api', getWordRoutes);

export default app;
