import * as socketio from 'socket.io';
import { User } from '../utils/types';
import { users } from '..';

export const registerAuthHandlers = (socket: socketio.Socket, io: socketio.Server) => {
  socket.on('new login', (user: User) => {
    if (!users.some((existingUser) => existingUser.username === user.username)) {
      users.push(user);
      io.emit('new user added', { users, newUser: user });
    }
  });
};
