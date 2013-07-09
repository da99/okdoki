"use strict";


var Chat_Rooms = {
  fav_success_msg: null
};

// ================================================================
// ================== Helpers =====================================
// ================================================================

function draw_chat_room_fav(data, enter_it) {
  var o = compile_template('#Chat_Rooms div.room.out', data);
  on_click(o.find('a.enter'), enter_chat_room);
  $('#Out_Rooms div.rooms').prepend(o);
  if (enter_it)
    o.find('a.enter').click();
  return o;
}

function leave_chat_room() {
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

}

function enter_chat_room() {
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
    var room_in = compile_template('#Chat_Rooms div.room.in', {
      chat_room_screen_name: name,
      owner_screen_name    : o_name
    });
    on_click(room_in.find('a.leave'), leave_chat_room);
    $('#In_Rooms div.rooms').prepend(room_in);

  });
}

// ================================================================
// ================== Events ======================================
// ================================================================


// ==== On dom load,
// link-ify room enter & leave links.
$(function () {

  $('#Out_Rooms div.room.out a.enter').each(function (i, e) {
    on_click($(e), enter_chat_room);
  });

  $('#In_Rooms div.room.out a.leave').each(function (i, e) {
    on_click($(e), leave_chat_room);
  });

});


on('before success #Create_Chat_Room_Fav', function (o) {
  o.flow.stop();
  $('#Create_Chat_Room_Fav input[type="text"]').val("");
  o.form.make_like_new();
  draw_chat_room_fav(o.data, true);
});

on('chat room entered', function (result) {
  var sn = result.screen_name;
  $('select.room_screen_name').each(function (i, e) {
    var o = $('<option></option>');
    o.attr('value', sn);
    o.text(sn);
    $(e).prepend(o);
  });
});


on('chat room entered', function (result) {
  $('select.room_screen_name').each(function (i, e) {
    var parent = $(e).parent('.span');
    if ($(e).find('option').length < 2)
      parent.hide();
    else
      parent.show();
  });
});


on('chat room leave', function (result) {
  var sn = result.screen_name.toUpperCase();
  $('select.room_screen_name option').each(function (i, e) {
    if ($(e).text().toUpperCase() === sn)
      $(e).remove();
  });

  $('select.room_screen_name').each(function (i, e) {
    if ($(e).find('option').length < 2)
      $(e).parent('.room_menu').hide();
  });
});
