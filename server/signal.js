const app = require('express')();
app.get('/', function(req, res){
  res.write('This is the relay server');
  res.end();
});

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', (socket) =>
{
	console.log('someone connected!');

  socket.on('keyup', (response) => {
    console.log('keyup', response);

    // forward to robot server
    socket.broadcast.emit('keyup', response);
  });

  socket.on('keydown', (response) => {
    console.log('keydown', response);

    // forward to robot server
    socket.broadcast.emit('keydown', response);
  });
});

const signalServer = require('simple-signal-server')(io)
const allIDs = new Set()

signalServer.on('discover', (request) => {
  console.log('discovering');
  const clientID = request.socket.id // you can use any kind of identity, here we use socket.id
  allIDs.add(clientID) // keep track of all connected peers
  request.discover(clientID, Array.from(allIDs)) // respond with id and list of other peers
})

signalServer.on('disconnect', (socket) => {
  console.log('disconnecting');
  const clientID = socket.id
  allIDs.delete(clientID)
})

signalServer.on('request', (request) => {
  request.forward() // forward all requests to connect
})

server.listen(3001, function(){
  console.log('listening on *:3001');
});
