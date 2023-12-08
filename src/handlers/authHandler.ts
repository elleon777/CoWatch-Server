import * as socketio from 'socket.io';
import { User } from '../models/user';
import { TUser } from '../utils/types';

export const registerAuthHandlers = (socket: socketio.Socket, io: socketio.Server) => {
  const authLogin = (user: TUser) => {
    const newUser = new User(user.id, user.username);
    newUser.save();
  };

  socket.on('auth:login', authLogin);
};
