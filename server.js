var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

var server=app.listen(8888,function(){
    console.log('****** Server started ******');});

app.use(express.static(__dirname + '/'));

io.sockets.on('connection', function(socket){
	socket.on('send message', function(data){
	io.sockets.emit('new message', data);
	});
});

