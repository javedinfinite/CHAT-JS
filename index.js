var http = require('http');
var fs = require('fs');
var  server = require('ws').Server;
var s  = new server({port:5001});//port for socket

 
 var temp = http.createServer(function (req, resp) {
 
    fs.readFile('index.html', function (error, pgResp) {
        if (error) {
            resp.writeHead(404);
            resp.write('Contents you are looking are Not Found');
        } else {
            resp.writeHead(200, { 'Content-Type': 'text/html' });
            resp.end(pgResp);
		//pgResp.sendFile(__dirname + '/index.html');
        }
    });
});
temp.listen(process.env.PORT || 5002);//port for server
console.log('server is running.....');
// When a connection is established
s.on('connection', function(ws) {
	console.log('one more client is added');
	// When data is received
	ws.on('message',function(message){

		message = JSON.parse(message);//since message is in json format hence we
		if(message.type=="name"){
			ws.personName = message.data;
			return;
		}
		console.log("Received from "+ws.personName+",message="+message.data);

		//broadcast received message to every client online by iterating over all the connected client
		s.clients.forEach(function e(client){
			if(client!= ws)//if client is not the current socket(i.e. message sender client)
 				client.send(JSON.stringify({
					name: ws.personName,
					data:	message.data			
				}));		 
		
		});


			
		//ws.send("message received by the server is :"+ message);
			
	});
	// when socket is closed
	ws.on('close',function(){
		console.log("One client is disconnected");	
	});
});


 
