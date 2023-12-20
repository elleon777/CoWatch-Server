import * as socketio from 'socket.io';
export const registerPlayerHandlers = (socket: socketio.Socket, io: socketio.Server) => {

  

  socket.on('player:readyPlay', () => {

    // socket.broadcast.to(roomId).emit();
  });

  socket.on('player:sendTime', (obj: { currentTime: any; roomId: any }) => {
    const { currentTime, roomId } = obj;
    socket.broadcast.to(roomId).emit('sync', currentTime);
  });
  socket.on('player:play', (roomId: string) => {
    socket.broadcast.to(roomId).emit('syncPlay');
  });
  socket.on('player:pause', (roomId: string) => {
    socket.broadcast.to(roomId).emit('syncPause');
  });
  socket.on('player:requestVideo', (obj: { src: string; roomId: string }) => {
    const { src, roomId } = obj;
    io.to(roomId).emit('syncRequestVideo', src);
  });
};
