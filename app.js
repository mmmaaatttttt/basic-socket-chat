const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const users = [];

app.use(express.static(__dirname + "/public"));
app.use('/scripts', express.static(__dirname + "/node_modules"));
app.set('view engine', 'pug');

io.on('connection', socket => {
  let username = '';

  socket.on('new user from client', data => {
    username = data.username;
    users.push(username)
    io.emit('new user from server', { users });
  });

  socket.on('disconnect', () => {
    const idx = users.findIndex(u => u === username);
    users.splice(idx, 1);
    io.emit('disconnected user from server', { username, users });
  });

  socket.on('new message from client', data => {
    io.emit('new message from server', data);
  });

  socket.on('new gif from client', data => {
    io.emit('new gif from server', data);
  });
});

app.get('/', (req, res) => res.render('index'));

http.listen(3000, () => console.log("Server is listening on port 3000"));
