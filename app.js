
//Requiero librerias
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

//Habilitar esta escucha del servidor en internet
//server.listen(process.env.PORT);

//Inicio escucha del servidor en local
server.listen(8888,function(){
	console.log('Ready! Server starded in http://localhost:8888');
});

app.use(express.static(__dirname + '/src'));


//objecto para guardar en la sesión del socket a los que se vayan conectando
var usuariosOnline = {};
var conectados = 0;

io.sockets.on('connection', function(socket){
	
	//cuando el usuario conecta al chat comprobamos si está logueado
	//el parámetro es la sesión login almacenada con sessionStorage
	socket.on("loginUser", function(username)
	{
		//si existe el nombre de usuario en el chat
		if(usuariosOnline[username])
		{
			socket.emit("userInUse");
			return;
		}
		//Guardamos el nombre de usuario en la sesión del socket para este cliente
		socket.username = username;
		//añadimos al usuario a la lista global donde almacenamos usuarios
		usuariosOnline[username] = socket.username;
		//mostramos al cliente como que se ha conectado
		socket.emit("funciones_chat", "welcome", socket.username);
		//mostramos de forma global a todos los usuarios que un usuario
		//se acaba de conectar al chat
		socket.broadcast.emit("funciones_chat", "conectado", socket.username );
		//actualizamos la lista de usuarios en el chat del lado del cliente
		io.sockets.emit("updateSidebarUsers", usuariosOnline);
	});

	conectados++;
	socket.emit('vtas', conectados);
	socket.broadcast.emit('vtas', conectados);

	socket.on('send message', function(message){
		//con socket.emit, el mensaje es para mi
		socket.emit("funciones_chat", "yo", message );
		//con socket.broadcast.emit, es para el resto de usuarios
		socket.broadcast.emit("funciones_chat", "usuario", message);

	});


	socket.on('disconnect', function(){
     	conectados--;
     	socket.broadcast.emit('vtas', conectados);

		//si el usuario, por ejemplo, sin estar logueado refresca la
		//página, el typeof del socket username es undefined, y el mensaje sería 
		//El usuario undefined se ha desconectado del chat, con ésto lo evitamos
		if(typeof(socket.username) == "undefined")
		{
			return;
		}
		//en otro caso, eliminamos al usuario
		delete usuariosOnline[socket.username];
		//actualizamos la lista de usuarios en el chat, zona cliente
		io.sockets.emit("updateSidebarUsers", usuariosOnline);
		//emitimos el mensaje global a todos los que están conectados con broadcasts
		socket.broadcast.emit("funciones_chat", "desconectado", socket.username);

 	});

	socket.on('sonidos', function(data){

		if(data=="zumbido"){
			socket.emit("funciones_sonidos", "zumbido-yo");
			socket.broadcast.emit("funciones_sonidos", "zumbido",socket.username);
		}
	});


});
