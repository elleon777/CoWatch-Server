var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});


const PORT = process.env.PORT || 9999;

let users = [];

app.get('/api/users', (req, res) => {
  console.log('send', users);
  res.send({ users });
});

io.on('connection', (socket) => {
  const { id } = socket.client;
  console.log('Успешное соединение', id);

  socket.on('new login', (user) => {
    users = [...users, user];
    io.sockets.emit('new user added', user);
    console.log(user);
  });

  socket.on('disconnect', () => {
    console.log('Отключился', id);
  });
  socket.on('sendTime', (currentTime) => {
    socket.broadcast.emit('sync', currentTime);
  });
  socket.on('playVideo', () => {
    socket.broadcast.emit('syncPlay');
    console.log('play');
  });
  socket.on('pauseVideo', () => {
    socket.broadcast.emit('syncPause');
    console.log('pause');
  });
  socket.on('requestVideo', (src) => {
    io.sockets.emit('syncRequestVideo', src);
  });
});

app.set('Port', PORT);

server.listen(PORT, () => {
  console.log(`connect to ${PORT} port`);
});
