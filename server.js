var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

server.listen(8888,function(){
    console.log('****** Server started ******');
	console.log('Open http://localhost:8888');});

app.use(express.static(__dirname + '/'));

var conectados = 0;
io.sockets.on('connection', function(socket){
	
	conectados++;
	socket.emit('vtas', conectados);
	socket.broadcast.emit('vtas', conectados);

	socket.on('send message', function(data){

	io.sockets.emit('new message', data);
	});

	socket.on('disconnect', function(){
     	conectados--;
     	socket.broadcast.emit('vtas', conectados);
 	});
});