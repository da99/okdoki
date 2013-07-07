"use strict";


on('screen name created', function (result) {
  var sn = result.screen_name;
  $('input[name="as_this_life"]').each(function (i, e) {
    $(e).replaceWith(compile_template('span.as_this_life.Chat_Rooms', {}));
  });;
});
