import * as socketio from 'socket.io';
import { TUser } from '../utils/types';
import { Room } from '../models/Room';
import { User } from '../models/User';
import { RoomRole } from '../utils/enums';

//TODO leave room when close page
type RoomArg = { roomId: string; userId: string };

export const registerRoomHandlers = (socket: socketio.Socket, io: socketio.Server) => {
  const createRoom = (): void => {
    const room = new Room();
    room.save();
    io.emit('rooms:update');
    socket.emit('room:join', Room.getLastIndexRoom());
  };

  const joinRoom = ({ roomId, userId }: RoomArg): void => {
    Room.addUserToRoom({ roomId, userId });
    User.setRoomRole(socket.id);
    socket.join(String(roomId));
    io.emit('room:updateUsers');
  };

  const leaveRoom = ({ roomId, userId }: RoomArg): void => {
    Room.leaveRoom({ roomId, userId }, () => {
      io.emit('rooms:update');
    });
    socket.leave(String(roomId));
    io.emit('room:updateUsers');
  };
  const disconnectRoom = (userId: string): void => {
    const currentUser = User.findUser(userId);
    if (currentUser?.currentRoomId) {
      const roomId = currentUser?.currentRoomId;
      Room.leaveRoom({ roomId, userId }, () => {
        console.log('обновление комнат');
        io.emit('rooms:update');
      });
      socket.leave(String(roomId));
    }
    User.leaveUser(userId);
    io.emit('room:updateUsers');
  };

  socket.on('room:create', createRoom);
  socket.on('room:join', joinRoom);
  socket.on('room:leave', leaveRoom);
  socket.on('disconnect', () => disconnectRoom(socket.id));
};
