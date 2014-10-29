// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;


// Routing
app.use(express.static(__dirname + ''));


// Chatroom

var rooms = {};
rooms['room1'] = {id:"room1", users:{}};
rooms['room2'] = {id:"room2", users:{}};
rooms['room3'] = {id:"room3", users:{}};


// usernames which are currently connected to the chat
var usernames = {};


function addUser (room, user)
{
	var timestamp = Date.now();
	//user.id = 'u_' + timestamp;
	if (rooms[room])
		rooms[room].users[user.userName]= user;
}

function removeUser(room, user)
{
	if (rooms[room] && rooms[room].users[user.userName])
		delete rooms[room].users[user.userName];
}



io.on('connection', function (socket) {

	// when the client emits 'add user', this listens and executes
  	socket.on('add user', function (username) {
  
    // we store the username in the socket session for this client
    socket.username = username;

	// we store the room number to the socket session
	
	socket.room = 'room1';
	
	
	// add client to the global list    
    var user = {
    	userName : username,
    	threadID : socket.room
    };
    
    
    usernames[username] = username;
    
    
    // send client to room 1
	socket.join('room1');
	
	
	var user = {
    	userName : socket.username,
    	threadID : 'room1'
    };
    	
		        
    
    // update rooms and users
    
    addUser('room1', user);
    
    
    // echo to client they've connected
	socket.emit('login', {
      username: socket.username,
      rooms : rooms
    });
	
	
	// echo to room 1 that a person has connected to their room
	socket.broadcast.to('room1').emit('user joined', user);
		
	// echo 	
	socket.emit('update rooms', rooms, 'room1');			

	
	// broadcast to everyone in room 1 the usernames of the clients connected.
	io.sockets.to('room1').emit('update users', rooms);
  

    console.log("user " + socket.username + " joined " + socket.room);
  });


  // when the client emits 'new message', this listens and executes
  socket.on('send chat', function (data) {
  	console.log("new message from " + socket.username + " from " + socket.room);
  	console.log(data.text);
  	data.authorName = socket.username;
    // we tell the client to execute 'new message'
    
    io.sockets.in(data.threadID).emit('update chat',  {
      message: data
    });
    
  });
	
	
 socket.on('switch room', function(newroom){
 
 		if (!(socket.room && socket.username))
 			return;
 			
 		// no need for this action if the user still same room	
 		if (socket.room == newroom)
 			return;
 	
		// leave the current room (stored in session)
		socket.leave(socket.room);
		
		// sent message to OLD room
		
		// add client to the global list    
    	var user = {
    		userName : socket.username,
    		threadID : socket.room
    	};
    	
    	socket.broadcast.to(socket.room).emit('user left', user);

		
		// update rooms and users of the old room
    
   	 	removeUser(socket.room, user);
   	 	console.log("removing user from room " + socket.room + "  "  + user )
		console.log(rooms[socket.room]);
		
		// broadcast to everyone in room the usernames of the clients connected.
		io.sockets.to(socket.room).emit('update users',rooms);
		
		socket.join(newroom);
		
		// echo to client they've connected to new room
		socket.emit('login', {
      		username: socket.username
    	});
		
				
		// update socket session room title
		socket.room = newroom;
		user.threadID = newroom;

		// echo to newroom that a person has connected to their room
		socket.broadcast.to(newroom).emit('user joined', user);
		
		console.log(socket.username+' has joined ' + newroom);
		socket.emit('update rooms', rooms, newroom);
		
		
		 
    	// update rooms and users of the new room
    	
   	 	addUser(newroom, user);
		console.log("adding user to room " + newroom + "  "  + user )
		console.log(rooms[newroom]);
		
		
		// broadcast to everyone in room the usernames of the clients connected.
    	io.sockets.to(newroom).emit('update users',rooms);

		
	});
 		
  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
  
  	if (!(socket.username && socket.room))
  	{
  		return;
  	}
  	console.log("user " + socket.username  +" discconect");
    // remove the username from global usernames list
    delete usernames[socket.username];

	// update list of users in chat, client-side
	io.sockets.emit('update users', usernames);	
    // echo globally that this client has left
    
	
    var user = {
    	userName : socket.username,
    	threadID : socket.room
    };

	
    socket.broadcast.emit('user left', user);
    
    console.log("user " + socket.username + " left " + socket.room);

    socket.leave(socket.room);

    
   	removeUser(socket.room, user);

	// broadcast to everyone in room the usernames of the clients connected.
	io.sockets.to(socket.room).emit('update users',rooms);

  });
});


var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Welcome to the XYZ chat server");

var userName = "";

console.log("Welcome " + userName + "!");

rl.on('line', function (cmd) {

  var res = (cmd).split(" ");
  switch(res[0])
  {
  	case "login":
  		
	rl.question("Login Name? ", function(username) {
		
 		if (!rooms['room1'].users[username])
 		{
 			username = username;
 			done = true;
 		}
 		else
 		{
 			console.log('Sorry, name taken.');
 		}
  		rl.close();
	});

  		break;
  	case "rooms": 
  		console.log('Active rooms are:');
  		for (var id in rooms) {
  			console.log('* ' + id + "(" + rooms[id].users.length + ")");
		}
		console.log('end of list.');
  		break;
  	case "join":
  		if (res[1] && rooms[res[1]])
  		{
  			console.log('entering room: ' + res[1]);
  		}
  		break;	
  }
});



// Start server



server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

