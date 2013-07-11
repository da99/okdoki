"use strict";

// ======================================
//
// Required DOM:
//   #Messages
//
// ======================================

var CHAT_MSG_LOOP      = false;
var PENDING_CHAT_MSG   = [];
var Chat_Msgs          = function () { };
Chat_Msgs.Room_Count   = 0;
Chat_Msgs.MAX          = 300;
Chat_Msgs.DOM          = $('#Messages');
Chat_Msgs.Write        = $('#Write');
Chat_Msgs.Room_Menu    = Chat_Msgs.Write.find('select[name="chat_room_screen_name"]');

create_event('chat room msg');

// === Submitting a msg ===

on('before success #Write_To_Chat_Room', function (o) {
  o.flow.stop();
  o.form.draw_success_msg(o.data.msg);
  Chat_Msgs.Write.find('textarea').val("");
  emit('chat room msg', o.data);
});



// === Added message to DOM
on('chat room msg', function (msg) {
  if (!msg.body && msg.msg)
    msg.body = msg.msg;

  var template_msg = _.defaults(msg, {
    author_screen_name: '',
    room_name: '',
    id: msg.id || (new Date).getTime()
  });

  var o = compile_template('div.msg', template_msg);
  msg.dom_id = '#' + o.attr('id');

  Chat_Msgs.DOM.prepend(o);
});

// === Add CSS classes.
on('chat room msg', function (msg) {
  var o = $(msg.dom_id);

  if (msg.is_official)
    o.addClass('official');

  if (msg.is_me)
    o.addClass('me');

  if (msg.is_error)
    o.addClass('error');

  if (msg.is_official || msg.is_error)
    o.find('div.meta').remove();
});

// === Remove extra messages
on('chat room msg', function (msg) {
  var length = Chat_Msgs.DOM.find('div.msg').length;
  if (length > Chat_Msgs.MAX)
    Chat_Msgs.DOM.find.find('div.msg').last().remove();
});

// ======  Entering/Leaving Chat Rooms ====
on('after enter chat room', function (o) {
  var menu = Chat_Msgs.Room_Menu;
  var opt  = $('<option></option>');
  opt.attr('value', o.room.name);
  opt.text(o.room.name);
  menu.prepend(opt);
  if (menu.find('option').length > 1)
    menu.parent('span.to').show();
  else
    menu.parent('span.to').hide();
  Chat_Msgs.Write.show();

  CHAT_MSG_LOOP = true;
});

on('after leave chat room', function (o) {
  var menu = Chat_Msgs.Room_Menu;

  menu.find('option').each(function (i, opt) {
    if ($(opt).attr('value') === o.room.name)
      $(opt).remove();
  });

  if (menu.find('option').length < 2)
    menu.parent('span.to').hide();

  if (menu.find('option').length < 1) {
    Chat_Msgs.Write.hide();
    CHAT_MSG_LOOP = false;
  }

});


var CHAT_MSG_Interval = setInterval(function () {
  if (!CHAT_MSG_LOOP)
    return;
  post("/chat_room/heart_beep", {}, function (err, result) {
    if (err) {
      return;
    }
    if (result.msg_list) {
      PENDING_CHAT_MSG = PENDING_CHAT_MSG.concat(result.msg_list);
      draw_all_msgs();
    }
  });
}, 3000);


function draw_all_msgs() {
  var m = PENDING_CHAT_MSG.shift();
  if (!m)
    return;
  emit('chat room msg', m);
  setTimeout(draw_all_msgs, 500);
}


