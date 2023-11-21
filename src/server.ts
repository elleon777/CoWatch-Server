import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import cors from 'cors';

import { User } from './types';
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

app.get('/api/users', (req: Request, res: Response) => {
  console.log(users);
  res.send(users);
});
app.post('/api/users', (req: Request, res: Response) => {
  const user = req.body;
  console.log(user)
  res.send(users);
});

io.on('connection', (socket) => {
  const { id } = socket;
  console.log('Успешное соединение', id);

  socket.on('new login', (user: User) => {
    if (!users.some((existingUser) => existingUser.username === user.username)) {
      users = [...users, user];
      io.emit('new user added', user);
    }
  });

  socket.on('disconnect', () => {
    console.log('Отключился', id);
  });
  socket.on('sendTime', (currentTime) => {
    socket.broadcast.emit('sync', currentTime);
  });
  socket.on('playVideo', () => {
    socket.broadcast.emit('syncPlay');
  });
  socket.on('pauseVideo', () => {
    socket.broadcast.emit('syncPause');
  });
  socket.on('requestVideo', (src) => {
    io.emit('syncRequestVideo', src);
  });
});

app.set('Port', PORT);

server.listen(PORT, () => {
  console.log(`connect to ${PORT} port`);
});
