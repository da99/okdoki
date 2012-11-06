
var express = require('express'),
pub         = __dirname + '/public',
app         = express(),
server      = require('http').createServer(app),
io          = require('socket.io').listen(server);

var port = process.env.PORT || 4567;
server.listen(port);

app.use(app.router);
app.use(express.static(pub));
app.use(express.errorHandler());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get( '/', function (req, res) {
  res.send('Not done. Come back in 72 hours.');
});

app.get( '/dev', function (req, res) {
  res.render('index', {title: 'Done :p'});
});

app.use(function (err, req, res, next) {
  res.send(500, "Something broke. Try later.");
});

// app.listen(port);
io.sockets.on('connection', function (socket) {
  socket.emit('entering', { html: '<p>Success!</p>' });
  socket.on('latest', function (data) {
    socket.emit('latest-response', {html: 'today on...'});
  });
  socket.on('repeat', function (data) {
    socket.emit('repeat-response', {html: '<p>You said: ' + data.msg });
  });
});

console.log('Listening on port: ' + port);







