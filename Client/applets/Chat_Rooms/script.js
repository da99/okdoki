"use strict";


var Chat_Rooms = {
  fav_success_msg: null
};

on('before success #Create_Chat_Room_Fav', function (o) {
  o.flow.stop();
  $('#Create_Chat_Room_Fav input[type="text"]').val("");
  Chat_Rooms.fav_success_msg = o.data.msg;
  o.form.draw_success_msg(o.data.msg);
  var o = compile_template('#Chat_Rooms div.room.out', o.data);
  $('#Out_Rooms div.rooms').prepend(o);
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
