"use strict";


// ================================================================
// ==== On dom load,
// ================================================================
$(function () {

  $('#Out_Rooms div.room').each(function (i, e) {
    Chat_Room.new(e);
  });

});


// ================================================================
// ================== Events ======================================
// ================================================================

on('before submit  #Create_Chat_Room_Fav', function (o) {
  var name = o.data.chat_room_screen_name = canonize_screen_name(o.data.chat_room_screen_name);
  var room = Chat_Room.find(name);
  if (room) {
    room.enter();
    o.flow.stop();
    o.form.make_like_new();
    return;
  }
})

on('before success #Create_Chat_Room_Fav', function (o) {
  o.flow.stop();
  o.form.make_like_new();

  Chat_Room.new(o.data.chat_room_screen_name, o.data.owner_screen_name);
  .enter();
});


// ================================================================
// ================== Main Object and Helpers =====================
// ================================================================


var Chat_Room = function () {};
Chat_Rooms.rooms = {};

// ================== Helpers =====================================

Chat_Room.find = function (u) {
  var name = (_.isString(u)) ? canonize_screen_name(u) :
    $(u).parent('div.room')
  .find('input[name="chat_room_screen_name"]')
  .val();

  return Chat_Room.rooms[name];
};

Chat_Room.enter = function () {
  return Chat_Room.find(this).enter();
};

Chat_Room.leave = function () {
  return Chat_Room.find(this).leave();
};


// ================== Main Functions ==============================
Chat_Room.new = function (raw_name, raw_o_name) {

  var old_dom = null;

  if (!_.isString(raw_name)) {
    old_dom    = $(raw_name);
    raw_name   = old_dom.find('input[name="chat_room_screen_name"]').val();
    raw_o_name = old_dom.find('input[name="owner_screen_name"]').val();
  }

  var name   = canonize_screen_name(raw_name);
  var o_name = canonize_screen_name(raw_o_name);

  var old = Chat_Room.find(name);
  if (old)
    return old;

  var room    = new Chat_Room;
  room.data   = {
    chat_room_screen_name : name,
    owner_screen_name     : o_name
  };

  Chat_Room.rooms[name] = room;
  room.is_in = false;

  room.draw_out(old_dom);
  room.draw_in();

};

Chat_Room.prototype.draw_out = function (old_dom) {
  if (old_dom) {
    var o = compile_template('#Chat_Rooms div.room.out', this.data);
    $('#Out_Rooms div.rooms').prepend(o);
  } else {
    var o = $(old_dom);
  }

  on_click(o.find('a.enter'), O.enter);
  this.out = o;
  return this;
};

O.prototype.draw_in = function () {
  var room_in = compile_template('#Chat_Rooms div.room.in', this.data);
  on_click(room_in.find('a.leave'), O.leave);
  $('#In_Rooms div.rooms').prepend(room_in);
  this.in = room_in;

  return this;
};

O.prototype.enter = function () {
  if (room.is_in)
    return this;

  var room   = $(this).parent('div.room');
  var name   = room.find('input[name="chat_room_screen_name"]').val();
  var o_name = room.find('input[name="owner_screen_name"]').val();

  room.addClass('loading');

  emit('chat room msg', {
    is_official: true,
    body: "Please wait... Entering room: " + name
  });

  var data = {
    chat_room_screen_name: name,
    owner_screen_name: o_name
  };

  post("/enter/chat_room", data, function (err, result) {
    room.removeClass('loading');
    if (err || !result.success) {
      emit('chat room msg', {
        is_official: true,
        body: "Try again later. Chat room unavailable: " + name
      });
      log(result.msg);
      return;
    }

    emit('chat room msg', {
      is_official: true,
      body: result.msg
    });

    room.hide();

  });
  return this;
}; // === enter

O.prototype.leave = function () {
  if (!room.is_in)
    return this;

  var room   = $(this).parent('div.room');
  var name   = room.find('input[name="chat_room_screen_name"]').val();
  var o_name = room.find('input[name="owner_screen_name"]').val();
  var out    = null;
  $('#Out_Rooms div.rooms')
  .find('input[name="chat_room_screen_name"]')
  .each(function (i) {
    if ($(this).val()!==name)
      return true;
    out = $(this).parent('div.room');
    return false;
  });

  room.addClass('loading');
  emit('chat room msg', {
    is_official: true,
    body: "Leaving room: " + name + '. Please wait...'
  });

  var data = {
    chat_room_screen_name : name,
    owner_screen_name     : o_name
  };

  var chat_msg = {
    is_official: true,
    body: "You're officially out of: " + name
  };

  var fin = function () {
    room.remove();
    out.show();
    emit('chat room msg', chat_msg);
  };
  post('/leave/chat_room', data, function (err, result) {
    if (err || !result.success) {
      setTimeout(fin, 4000);
      return;
    }

    fin();
  });
  return this;
}; // === leave






