import express from 'express';
import { roomController } from '../controllers/roomController';

export const roomRouter = express.Router();

roomRouter.get('/', roomController.getRooms);
roomRouter.get('/:id/users', roomController.getUsersFromRoom);
roomRouter.get('/:id/sources', roomController.getSourcesFromRoom);
