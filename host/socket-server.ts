
import http = require('http')
let server = http.createServer()
import socket_io = require('socket.io')
let io = socket_io(server)
io.on('connection', (client) => {
    client.on('event', function (data) { });
    client.on('disconnect', function () { });
})