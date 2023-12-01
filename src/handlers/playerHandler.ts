import * as socketio from 'socket.io';
export const registerPlayerHandlers = (socket: socketio.Socket, io: socketio.Server) => {
  socket.on('sendTime', (obj: { currentTime: any; roomId: any }) => {
    const { currentTime, roomId } = obj;
    socket.broadcast.to(roomId).emit('sync', currentTime);
  });
  socket.on('playVideo', (roomId: string) => {
    socket.broadcast.to(roomId).emit('syncPlay');
  });
  socket.on('pauseVideo', (roomId: string) => {
    socket.broadcast.to(roomId).emit('syncPause');
  });
  socket.on('requestVideo', (obj: { src: string; roomId: string }) => {
    const { src, roomId } = obj;
    io.to(roomId).emit('syncRequestVideo', src);
  });
};
