import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import cors from 'cors';

import { Room, User } from './types';
import { CLIENT_HOST, PORT } from './config';

const app: Express = express();

const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server(server, {
  cors: {
    origin: CLIENT_HOST,
    credentials: true,
  },
});

app.use(cors());

let users: User[] = [];
let rooms = ['1', '2'];

app.get('/api/users', (req: Request, res: Response) => {
  console.log(users);
  res.send(users);
});
app.get('/api/rooms', (req: Request, res: Response) => {
  res.send(rooms);
});
app.post('/api/users', (req: Request, res: Response) => {
  const user = req.body;
  console.log(user);
  res.send(users);
});

io.on('connection', (socket) => {
  const { id } = socket;
  console.log('Успешное соединение', id);

  socket.on('new login', (user: User) => {
    if (!users.some((existingUser) => existingUser.username === user.username)) {
      users = [...users, user];
      io.emit('new user added', { users, newUser: user });
    }
  });

  socket.on('disconnect', () => {
    console.log('Отключился', id);
  });

  // player
  socket.on('sendTime', (obj) => {
    const { currentTime, roomId } = obj;
    socket.broadcast.to(roomId).emit('sync', currentTime);
  });
  socket.on('playVideo', (roomId) => {
    socket.broadcast.to(roomId).emit('syncPlay');
  });
  socket.on('pauseVideo', (roomId) => {
    socket.broadcast.to(roomId).emit('syncPause');
  });
  socket.on('requestVideo', (src) => {
    io.emit('syncRequestVideo', src);
  });

  //rooms
  socket.on('createRoom', (roomId) => {
    rooms.push(roomId);
    console.log(rooms);
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(socket.id, 'подключился к', roomId);
  });

  socket.on('leaveRoom', (room) => {});
});

app.set('Port', PORT);

server.listen(PORT, () => {
  console.log(`connect to ${PORT} port`);
});
