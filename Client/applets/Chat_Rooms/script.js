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

function enter_chat_room(e) {
  var name = $(this)
  .parent('div.room')
  .find('span.chat_room_screen_name')
  .text()
  ;
  emit('chat room msg', {
    is_official: true,
    body: "Please wait... Entering room: " + name
  });
}

// ================================================================
// ================== Events ======================================
// ================================================================


// ==== On dom load, link-ify room enter links.
$(function () {
  $('#Out_Rooms div.room.out a.enter').each(function (i, e) {
    on_click($(e), enter_chat_room);
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
