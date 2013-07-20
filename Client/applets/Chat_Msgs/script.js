"use strict";

// ======================================
//
// Required DOM:
//   #Messages
//
// ======================================

var CHAT_MSG_OLDEST_EPOCH = 0;
var CHAT_MSG_LOOP      = false;
var PENDING_CHAT_MSG   = [];
var Chat_Msgs          = function () { };
Chat_Msgs.Room_Count   = 0;
Chat_Msgs.MAX          = 300;
Chat_Msgs.DOM          = $('#Messages');
Chat_Msgs.Write        = $('#Write');
Chat_Msgs.Room_Menu    = Chat_Msgs.Write.find('select[name="chat_room"]');

create_event('chat room msg');

// === Submitting a msg ===

on('before success #Write_To_Chat_Room', function (o) {
  o.flow.stop();
  o.form.reset_status();
  Chat_Msgs.Write.find('textarea').val("");
  emit('chat room msg', o.data.chat_msg);
});


// === Record time of oldest message
on('chat room msg', function (o) {
  if (!o.created_at_epoch)
    return;
  var time = parseInt(o.created_at_epoch);
  if (time >= CHAT_MSG_OLDEST_EPOCH)
    CHAT_MSG_OLDEST_EPOCH = time;
});

// === Added message to DOM
on('chat room msg', function (msg) {
  if (!msg.body && msg.msg)
    msg.body = msg.msg;

  var template_msg = _.defaults(msg, {
    author_screen_name : '',
    room_name          : '',
    dom_id             : 'm' + (msg.dom_id || msg.id || (new Date).getTime()),
    author             : msg.author || '',
    chat_room          : msg.room_name || ''
  });

  var o = Template.compile('div.msg', template_msg);

  if (msg.is_clean_body)
    o.find('div.body').html(msg.body);

  if (msg.link) {
    var a = $('<a/>');
    a.attr('href', msg.link);
    a.text('Read more...');
    o.find('div.body').append(a);
    o.find('span.said').text('Feed: ');
  }

  o.find('a').attr('target', '_blank');
  Chat_Msgs.DOM.prepend(o);
});

// === Add CSS classes.
on('chat room msg', function (msg) {
  var o = $('#' + msg.dom_id);

  if (msg.is_official)
    o.addClass('official');

  if (msg.is_me) {
    o.addClass('me');
    o.find('span.name').text(o.find('span.name').text() + ' (me)');
  }

  if (msg.is_error)
    o.addClass('error');

  if (msg.is_official || msg.is_error)
    o.find('div.meta').remove();
});

// === Remove extra messages
on('chat room msg', function (msg) {
  var length = Chat_Msgs.DOM.find('div.msg').length;
  if (length > Chat_Msgs.MAX)
    Chat_Msgs.DOM.find('div.msg').last().remove();
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
  if (APP_ERROR)
    return;

  if (!CHAT_MSG_LOOP)
    return;
  post("/chat_room/heart_beep", {start_at: CHAT_MSG_OLDEST_EPOCH}, function (err, result) {
    if (err) {
      return;
    }
    if (result.msg_list) {
      var o_length = PENDING_CHAT_MSG.length;
      PENDING_CHAT_MSG = PENDING_CHAT_MSG.concat(result.msg_list);
      if (o_length === 0)
        draw_all_msgs();
    }
  });
}, 3000);


function draw_all_msgs() {
  var m = PENDING_CHAT_MSG.shift();
  if (!m || (m.dom_id && $('#' + m.dom_id).length))
    return;
  emit('chat room msg', m);
  setTimeout(draw_all_msgs, 800);
}


