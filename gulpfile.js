var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	browserSync = require('browser-sync'),
	gulp = require('gulp');

server.listen(8888);
app.use(express.static(__dirname + '/src'));

var conectados = 0;
io.sockets.on('connection', function(socket){
	
	conectados++;
	socket.emit('vtas', conectados);
	socket.broadcast.emit('vtas', conectados);

	socket.on('send message', function(data){

	socket.emit('new message', data);
	});

	socket.on('disconnect', function(){
     	conectados--;
     	socket.broadcast.emit('vtas', conectados);
 	});
});

gulp.task('serve',function(){
    /*browserSync({
    	logPrefix: "ChatMe",
    	logConnections: true,
        files: ['src/*'],
        server: {
            baseDir: 'src/',
        },
    });*/
    process.stdout.write('Starting server in http://localhost:8888\n');
});
