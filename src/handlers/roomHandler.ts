import * as socketio from 'socket.io';
import { rooms } from "..";

export const registerRoomHandlers = (socket: socketio.Socket, io: socketio.Server) => {
  socket.on('createRoom', (roomId: string) => {
    rooms.push(roomId);
  });

  socket.on('joinRoom', (roomId: string) => {
    socket.join(roomId);
    console.log(socket.id, 'подключился к', roomId);
  });

  socket.on('leaveRoom', (roomId: string) => {});
};