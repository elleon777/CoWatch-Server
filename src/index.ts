import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import cors from 'cors';

import { Room, User } from './utils/types';
import { CLIENT_HOST, PORT } from './utils/config';
import { registerRoomHandlers } from './handlers/roomHandler';
import { registerPlayerHandlers } from './handlers/playerHandler';
import { registerAuthHandlers } from './handlers/authHandler';

const app: Express = express();

const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server(server, {
  cors: {
    origin: CLIENT_HOST,
    credentials: true,
  },
});

app.use(cors());

export let users: User[] = [];
export let rooms = ['1', '2'];
app.get('/api/users', (req: Request, res: Response) => {
  console.log(users);
  res.send(users);
});
app.get('/api/rooms', (req: Request, res: Response) => {
  res.send(rooms);
});

const onConnection = (socket: socketio.Socket) => {
  const { id } = socket;
  console.log('Успешное соединение', id);
  registerPlayerHandlers(socket, io);
  registerRoomHandlers(socket, io);
  registerAuthHandlers(socket, io);
  socket.on('disconnect', () => {
    console.log('Отключился', id);
  });
};

io.on('connection', onConnection);

app.set('Port', PORT);

server.listen(PORT, () => {
  console.log(`connect to ${PORT} port`);
});
