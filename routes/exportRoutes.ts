import express from 'express';
//import {exportCommentsToCSV  } from '../controllers/exportController';
const router = express.Router();

// Example route (Replace with actual logic)
router.get('/export', (req, res) => {
    res.send('Export route working!');
});
// router.get('/export', async (req: Request, res: Response) => {
   //  await exportCommentsToCSV(req, res);
 //});

//export default router;

