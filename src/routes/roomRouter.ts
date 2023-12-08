import express from 'express';
import { roomController } from '../controllers/roomController';

export const roomRouter = express.Router();

roomRouter.get('/', roomController.getRooms);
roomRouter.get('/:id', roomController.getUsersFromRoom);
