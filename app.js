const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + "/public"));
app.use('/scripts', express.static(__dirname + "/node_modules"));
app.set('view engine', 'pug');

io.on('connection', () => console.log("NEW USER!"))

app.get('/', (req, res) => res.render('index'));

http.listen(3000, () => console.log("Server is listening on port 3000"));
