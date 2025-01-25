import { createServer } from 'node:http';
import express from 'express';
import { Server as SocketServer } from 'socket.io';

const app = express(); // <-- Création de l'application express
const server = createServer(app); // <-- Création du serveur HTTP    
const io = new SocketServer(server); // <-- Création du serveur de socket

// On définie un middleware pour gérer les fichiers statics
app.use(express.static('public')); 

// On définie des routes
app.get('/', (_, res) => { 
	res.redirect('/index.html'); // <-- Redirection vers la page index.html
});

// On démarre le serveur sur le port 3000
server.listen(3000, () => {
	console.log('Server started on port 3000');
});

////////////// WebSocket //////////////

const typingUsers = new Set()

io.on('connection', (socket) => { // <-- Quand un client se CONNECTE   
	console.log('New connection', socket.id);
	io.emit('system_message',{
		content:`${socket.id} est connecté`
	})

	socket.on('disconnect', () => { // <-- Quand un client se DECONNECTE
		console.log('Disconnected', socket.id);
		io.emit('system_message',{
			content:`${socket.id} s'est déconnecté`
		})
	});



	socket.on('user_message_send', (michel) => {
		console.log("nouveau message",michel)
	for(const [id, sock] of io.sockets.sockets){
		sock.emit('user_message',{
			content: michel.content,
			author: socket.id,
			time: new Date().toLocaleDateString(),
			isMe: false,
	})	
		
		}
	    
		

	}) 
	socket.on("typing_start",() => {
		typingUsers.add(socket.id)
		io.emit('typing',Array.from(typingUsers));
	});

	socket.on("typing_stop",() => {
		typingUsers.delete(socket.id);
		io.emit('typing',Array.from(typingUsers));
	})

})




