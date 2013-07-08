"use strict";


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
