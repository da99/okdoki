
$(function() {


  // When using more than one `textarea` on your page, change the following line to match the one you’re after
  var $textarea = $('#markdown_ex_content'),
  $preview      = $('#html_ex');


  var text =  "This is my list of things I hate. \n" + 
"===================\n" +
"* women\n* men\n* animals\n" +
"When people read this list, they say: \n" +
"> Are you a self-hating human?";

  var converter = new Showdown.converter();
  $preview.html(converter.makeHtml(text));

  var socket = io.connect('http://localhost:4567');
  socket.on('entering', function (data) {
    $('#chatroom').html($('#chatroom').html() + data.html);
    socket.emit('latest', {});
  });

  socket.on('latest-response', function (data) {
    $('#chatroom').html($('#chatroom').html() + data.html);
  });

  socket.on('response-response', function (data) {
    alert("Response: " + data.html);
  });

});
