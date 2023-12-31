import express from 'express';
import { parserController } from '../controllers/parserController';

export const parserRouter = express.Router();

parserRouter.get('/', parserController.getSourcesFromURL);
// parserRouter.get('/subtitles', parserController.downloadSubtitles);

