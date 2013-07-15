"use strict";


function add_dom_screen_name(name) {

  if (!name) {
    return Screen_Name.screen_name();
  }

  var parent = $('#Other_Screen_Names');
  var li = $('<li><a href=""></a></li>');
  li.find('a').attr('href', "/me/" + name);
  li.find('a').text(name);

  parent.find('ul').prepend(li);
  parent.show();
}

$(function () {


  // ============================================
  // ================ Create life................
  // ============================================
  if ($('#New_Life').length)
    form('#Create_Screen_Name', function (f) {
      f.at_least_one_not_empty('input[name="screen_name"]');
      f.on_success(function (result) {
        Control_Panel.show();
        f.find('div.success').html('Your new life is at: <a href="/me/SN">okdoki.com/me/SN</a>'.replace(/SN/g, result.screen_name));
        screen_name(result.screen_name);
      });
    });


}); // ==== jquery on dom ready




