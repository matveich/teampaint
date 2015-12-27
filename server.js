var express = require('express');
var app = express();
var server = require('http').Server(app);
//var io = require('socket.io')(server);

app.use(express.static('static'));

server.listen(8080);

console.log('Server started...');

app.get('/', function (req, res) {
	res.sendfile('static/index.html');
});

/*var connected_users = [];

var paints = [];

function find(val, prop) {
	for (var i = 0; i < connected_users.length; i++) {
		if (connected_users[i][prop] == val) {
			return i;
		}
	}
	return -1;
}

function randPaintId() {
	var s = "";
	for (var i = 0; i < 32; i++) {
		s += (Math.random() * 10) % 10;
	}
	return s;
}

io.on('connection', function (socket) {
	console.log('Client connected');
	var users = [];
	for (var x = 0; x < connected_users.length; x++) {
		users.push(connected_users[x].user);
	}
	socket.emit('users online', {users: users});

	socket.on('enter', function(data) {
		console.log('User: ' + data['usr']);
		if (find(data['usr'], 'user') == -1) {
			socket.emit('enterReq', {message: 'success'});
			connected_users.push({socket: socket.id, user: data['usr']});
			io.sockets.emit('new user', {user: data['usr']});
		}
		else {
			socket.emit('enterReq', {message: 'already in'});
		}
	});

	socket.on('create paint', function(data) {
		paints.push({id: randPaintId(), name: data.name, team: data.team});

	});

	socket.on('disconnect', function() {
		console.log('Client disconnected');
		if (find(socket.id, 'socket') != -1) {
			socket.broadcast.emit('disconnected', {user: connected_users[find(socket.id, 'socket')].user});
			connected_users.splice(find(socket.id, 'socket'), 1);
		}
	});
});*/
