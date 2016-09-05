express    = require('express');
bodyParser = require('body-parser');
app        = express();
server     = require('http').createServer(app); 
io         = require('socket.io')(server);
fs         = require('fs');
path       = require('path');
exec       = require('child_process').exec;



app.use(bodyParser.urlencoded({ extended: false } ));
app.use(express.static('html'));
app.use(express.static('script'));

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
}

// Set socket.io listeners.
io.on('connection', function(client) { 
	console.log('a user connected');
	//client.emit('message', 'Vous êtes bien connecté !');
	client.broadcast.emit('message', 'Un autre client vient de se connecter !');

	client.on('message', function (message) {
        	console.log('Un client me parle ! Il me dit : ' + message);
	});
        client.on('key', function (key) {
                console.log('key received : ' + key);
		client.emit('key', key);
                client.broadcast.emit('key', key);
        });

        client.on('command', function (command) {
		switch (command) {
			case "reboot" :
				execute('shutdown -r now', function(callback){
					console.log(callback);
				});
			break;
			default:
		}
        });
	client.on('disconnect', function(data)  {
    		console.log('user disconnected');
	});
});

app.get('/', function(req, res,next) {  
	res.sendFile(__dirname + '/index.html');
});


server.listen(3000, function() {
	console.log("Listening on 3000");
});  

