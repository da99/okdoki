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
  $(o).find('select.as_this_life').each(function (i, e) {
    _.each(Customer_Lifes.sn_new, function (n) {
      $(e).prepend(Customer_Lifes.new_opt(n));
    });
  });
});

on('after success #Create_Screen_Name', function (result) {
  var sn = result.screen_name;
  Customer_Lifes.sn_new.push(sn);
  $('select.as_this_life').each(function (i, e) {
    $(e).prepend(Customer_Lifes.new_opt(sn));
  });
  return sn;
});
