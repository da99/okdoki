
function toggle(ele) {

  var a            = $(ele);
  var header       = a.parent('div.header');
  var bot          = header.parent('div.bot');
  var bot_sn       = bot.find('input[name="screen_name"]').val();
  var action       = a.hasClass('on') ? 'on' : 'off';
  var other_action = a.hasClass('on') ? 'off' : 'on';
  var other        = bot.find('a.' + other_action);

  if (a.hasClass("is_" + action))
    return;

  header.addClass('loading');

  var new_val = action == 'on' ? true : false;
  post('/Bot_Use', {_method: 'PUT', is_on: new_val, bot_screen_name: bot_sn}, function (err, raw) {
    var result = to_json_result(raw);

    if (result.success) {
      a.addClass('is_' + action);
      other.removeClass('is_' + other_action);
    }

    // We ignore errors for now. Just reset bot box if there was an error.
    header.removeClass('loading');
  });
}

$(function () {

  on_click('a.on',  function () {
    toggle(this);
  });

  on_click('a.off', function () {
    toggle(this);
  });

}); // === $(func)
