var socket = io('http://127.0.0.1:8888');

function user_isValid(username) {
    return username.match(/^[a-z0-9A-Z_-]{4,20}$/);
}

var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
    return {
    	x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
	};
}

var drew_dots = [];
var brush_width = 3;

function draw(c, evt) {
	var ctx = c.getContext("2d");
	var mousePos = getMousePos(c, evt);
	var x = Math.round(mousePos.x);
	var y = Math.round(mousePos.y);

	if (drew_dots.length > 0) {
		ctx.lineWidth = brush_width;
		ctx.moveTo(drew_dots.slice(-1)[0].x, drew_dots.slice(-1)[0].y);
		ctx.lineTo(x, y);
		ctx.stroke();
		drew_dots.push({x: x, y: y});
	}
	else{
		ctx.fillRect(x, y, brush_width, brush_width);
		drew_dots.push({x: x, y: y});
	}
}


var chosen_users = [];

function selectUser(evt) {
	if (chosen_users.indexOf(evt.target.id) == -1) {
		chosen_users.push(evt.target.id);
		$("#" + evt.target.id).addClass('selected');
	}	
	else {
		chosen_users.splice(chosen_users.indexOf(evt.target.id), 1);
		$("#" + evt.target.id).removeClass('selected');
	}
}

function selctPaint(evt) {

}

$(document).ready(function() {
	console.log('ready');
	$('body').append("<div id='users'></div>");
	$('#users').append("<label>Сейчас онлайн:</label>");
	$('#users').append("<ul id='userList'></ul>");
	$('body').append("<div id='paints'></div>");
	$('#paints').append("<label>Рисунки:</label>");
	$('#paints').append("<ul id='paintList'></ul>");
	socket.on('users online', function(data) {
		console.log(data);
		if (data.users !== undefined) {
			for (var i = 0; i < data.users.length; i++) {
				$('#userList').append('<li class="user" id="' + data.users[i] + '">' + data.users[i] +"</li>")
				$("#" + data.users[i]).on('click', function(evt) {
					selectUser(evt);
				});
			}
		}
		if (data.paints !== undefined) {
			for (var i = 0; i < data.paints.length; i++) {
				$('#userList').append('<li class="paint" id="' + data.paints[i] + '">' + data.paints[i] +"</li>")
				$("#" + data.paints[i]).on('click', function(evt) {
					selectPaint(evt);
				});
			}
		}
	});
	
	socket.on('new user', function(data) {
		$('#userList').append("<li class='user' id='" + data.user + "'>" + data.user + "</li>")
		$("#" + data.user).on('click', function(evt) {
			selectUser(evt);
		});
	});

	socket.on('disconnected', function(data) {
		alert(data.user);
		$('#' + data.user).remove();
	});


	$('#enter').click(function () {
		console.log('click');
		if (user_isValid($('#username').val())) {
			socket.emit('enter', {usr: $('#username').val()});
			socket.on('enterReq', function(data) {
				if (data['message'] == 'success') {
					if ($('#create').length == 0) {
						$('body').append("<button id='create'>Создать рисунок</button>");
					}
					if ($('#join').length == 0) {
						$('body').append("<button id='join'>Присоединиться</button>");
					}
					if (('#roomName').length == 0) {
						$('body').append("<label>Название:</label>");
						$('body').append("<input id='roomName'>");
					}
					document.getElementById('create').addEventListener('click', function(evt) {
						if (chosen_users.length === 0) {
							$('body').append("<label>Выберите команду</label>");
						}
						else {
							if (user_isValid($('#paintName').val())) {
								socket.emit('create paint', {name: $('#paintName').val(), team: chosen_users});								
							}
							else {
								$('body').append("<label>Название рисунка содержит недопустимые символы</label>");
							}
						}
					});
				}
				else {
					if (data['message'] == 'already in') {
						$('body').append("<label>Пользователь с таким именем уже на сайте. Выберите другое имя</label>");
					}
				}
			});
		}
		else {
			$('body').append("<label>Логин содержит недопустимые символы</label>");
		}
	});
	var c = document.getElementById("field");
	c.height = CANVAS_HEIGHT;
	c.width = CANVAS_WIDTH;
	c.addEventListener('mousemove', function(evt) {
		if (evt.which == 1 || evt.buttons == 1) {
			draw(c, evt);
		}
	});
	c.addEventListener('mousedown', function(evt) {
		draw(c, evt);
	});
	c.addEventListener('mouseup', function(evt) {
		drew_dots.length = 0;
	});
});