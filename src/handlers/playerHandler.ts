import * as socketio from 'socket.io';
import { TUser } from '../utils/types';
import { RoomRole } from '../utils/enums';
import { User } from '../models/User';

export const registerPlayerHandlers = (socket: socketio.Socket, io: socketio.Server) => {
  // TODO:
  // 1: переработать управления видео не у хоста
  const syncTime = (obj: { currentTime: any; roomId: string }) => {
    const { currentTime, roomId } = obj;
    if (User.getRoomRole(socket.id) === RoomRole.Host) {
      io.to(roomId).emit('player:syncTime', currentTime);
    }
  };
  const syncPlay = (roomId: string) => {
    socket.broadcast.to(roomId).emit('player:syncPlay');
  };
  const syncPause = (roomId: string) => {
    socket.broadcast.to(roomId).emit('player:syncPause');
  };
  const syncUsersTime = (obj: { roomId: string; currentUser: TUser; currentTime: any }) => {
    const { roomId, currentUser, currentTime } = obj;
    io.to(roomId).emit('player:userTime', { currentUser, currentTime });
  };

  const syncUpdateSources = (roomId: string) => {
    io.to(roomId).emit('player:updateSources');
  };

  socket.on('player:syncTime', syncTime);
  socket.on('player:play', syncPlay);
  socket.on('player:pause', syncPause);
  socket.on('player:userTime', syncUsersTime);
  socket.on('player:updateSources', syncUpdateSources);
};
