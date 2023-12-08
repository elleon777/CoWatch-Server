import express from 'express';
import { parserController } from '../controllers/parserController';

export const parserRouter = express.Router();

parserRouter.post('/', parserController.getSourcesFromURL);

