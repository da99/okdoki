"use strict";

create_event('screen name created');
create_event('chat room entered');
create_event('chat room leave');

var Customer_Lifes = {
  sn_new: [],
  new_opt: function (sn) {
    var o = $('<option></option>');
    o.attr('value', sn);
    o.text(sn);
    return o;
  }
};

on('template compiled', function (o) {
  if (Customer_Lifes.sn_new.length === 0)
    return;

  $(o.dom).find('select[name="as_this_life"]').each(function (i, e) {
    _.each(Customer_Lifes.sn_new, function (n) {
      $(e).prepend(Customer_Lifes.new_opt(n));
    });
  });
});

on('after success #Create_Screen_Name', function (result) {

  var sn = result.data.screen_name;
  Customer_Lifes.sn_new.push(sn);

  emit('screen name', {screen_name: sn});
  return sn;
});

on('screen name', function (m) {
  var sn = m.screen_name;
  // === Add new name to SELECT menus.
  $('select[name="as_this_life"]').each(function (i, e) {
    $(e).prepend(Customer_Lifes.new_opt(sn));
    $(e).val(sn);
    $(e).parent('span.as_this_life').show();
  });
});

on('screen name', function (m) {
  var o = $('<li><a href="/me/LIFE">LIFE</a></li>'.replace(/LIFE/g, m.screen_name));
  $('#Create_Life ul.screen_names').prepend(o);
});


// === When to open links in a new window.
var MAIN_PAGE = {
  in_chat_rooms : []
};

on('after enter chat room', function () {
  MAIN_PAGE.in_chat_rooms.push(1);
});

on('after leave chat room', function () {
  MAIN_PAGE.in_chat_rooms.pop();
});

$(function () {
  $('a').each(function (i, e) {

    var href = $(e).attr('href');
    if (href.indexOf('/log') > -1 || href.indexOf('#') > -1 )
      return;

    on_click(e, function () {
      var o = $(this);
      if (MAIN_PAGE.in_chat_rooms.length)
        window.open(o.attr('href'), '_blank');
      else
        window.location.href = o.attr('href');
    });

  });
});




