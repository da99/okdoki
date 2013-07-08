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

  $(o.selector).find('select[name="as_this_life"]').each(function (i, e) {
    _.each(Customer_Lifes.sn_new, function (n) {
      $(e).prepend(Customer_Lifes.new_opt(n));
    });
  });
});

on('after success #Create_Screen_Name', function (result) {

  var sn = result.data.screen_name;
  Customer_Lifes.sn_new.push(sn);

  // === Replace hiddens with SELECT menus.
  $('input[name="as_this_life"]').each(function (i, e) {
    $(e)
    .parent('span.as_this_life')
    .replaceWith(compile_template('span.as_this_life', {}));
  });


  // === Add new name to SELECT menus.
  $('select[name="as_this_life"]').each(function (i, e) {
    $(e).prepend(Customer_Lifes.new_opt(sn));
    $(e).val(sn);
  });

  return sn;
});
