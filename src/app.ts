import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

import { TRoom, TUser } from './utils/types';
import { CLIENT_HOST, PORT } from './utils/config';
import { registerAuthHandlers, registerPlayerHandlers, registerRoomHandlers } from './handlers';
import { roomRouter, parserRouter } from './routes';

const app: Express = express();

const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server(server, {
  cors: {
    origin: CLIENT_HOST,
    credentials: true,
  },
});

app.use(bodyParser.json());
app.use(cors());

// https://www.geeksforgeeks.org/how-to-manage-users-in-socket-io-in-node-js/

export let users: TUser[] = [];

app.use("/api/rooms", roomRouter)
app.use("/api/parser", parserRouter)

const onConnection = (socket: socketio.Socket) => {
  const { id } = socket;
  console.log('Успешное соединение', id);
  registerAuthHandlers(socket, io);
  registerPlayerHandlers(socket, io);
  registerRoomHandlers(socket, io);
  socket.on('disconnect', () => {
    console.log('Отключился', id);
  });
};

io.on('connection', onConnection);

app.set('Port', PORT);

server.listen(PORT, () => {
  console.log(`connect to ${PORT} port`);
});
