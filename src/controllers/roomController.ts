import express, { Express, Request, Response } from 'express';
import { Room } from '../models/Room';
import { User } from '../models/User';

export const roomController = {
  getRooms: (req: Request, res: Response) => {
    res.status(200).send(Room.getAllRooms());
  },
  getUsersFromRoom: (req: Request, res: Response) => {
    const usersFromRoom = User.findUsersFromRoom(req.params.id);
    // console.log('usersFromRoom', usersFromRoom);
    res.status(200).send(usersFromRoom);
  },
};
