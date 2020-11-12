var app = require('express')();
var configSocketIo = require("./socket/socket")
var socketIo = require('socket.io')
var http = require('http')

var server = http.createServer(app)
var io = socketIo(server)
configSocketIo(io)
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(process.PORT, () => console.log(3000))