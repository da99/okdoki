
$(function() {

  var socket = io.connect('http://okdoki-disk-drive-shopper.herokuapp.com/');

  socket.on('connection-response', function (data) {
    $('#chatroom').html($('#chatroom').html() + data.msg);
    socket.emit('what-is-new?', {});
  });

  socket.on('latest', function (data) {
    $('#chatroom').html($('#chatroom').html() + data.msg);
  });

  socket.on('info-response', function (data) {
    alert("Info: " + data.desc);
  });

});
