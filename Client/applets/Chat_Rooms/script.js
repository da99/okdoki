"use strict";


on('screen name created', function (result) {
  var sn = result.screen_name;
  $('input[name="as_this_life"]').each(function (i, e) {
    $(e).replaceWith(compile_template('span.as_this_life.Chat_Rooms', {}));
  });;
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
