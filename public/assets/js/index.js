
$(function() {

  var socket = io.connect('http://okdoki-disk-drive-shopper.herokuapp.com:80/');
  var refresh = null;
  // var socket = io.connect('http://localhost:5000/');

  function emit_refresh () {
    socket.emit('what-is-new?', {});
  };

  socket.on('connection-response', function (data) {
    console.log(data.msg);
    $('#chatroom').html($('#chatroom').html() + data.msg);
    emit_refresh();
  });

  socket.on('latest', function (data) {
    $('#chatroom').html($('#chatroom').html() + "<br />" + data.msg);
    refresh = parseInt(data.refresh);
    if(refresh < 5 || !(refresh > 5))
      refresh = 5;
    setTimeout(emit_refresh, refresh * 1000);
    $('#chatroom').html($('#chatroom').html() + "<br />Next uptime: " + refresh);
  });

  socket.on('info-response', function (data) {
    alert("Info: " + data.desc);
  });

});
