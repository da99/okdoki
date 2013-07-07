"use strict";

var Chat = {
  DOM: $('#Messages'),
  MAX: 300
};

create_event('draw_msg');

function set_obj_defaults(o, val, raw_names) {
  var names = _.toArray(arguments);
  names.shift();
  names.shift();
  _.each(names, function (n) {
    if (!o[n])
      o[n] = val;
  });
  return o;
}

// === Added message to DOM
on('draw_msg', function (msg) {
  var template_msg = _.defaults(msg, {
    author_screen_name: '',
    room_name: '',
    id: msg.id || (new Date).getTime()
  });

  var o = compile_template('div.msg', template_msg);
  msg.dom_id = '#' + o.attr('id');

  Chat.DOM.prepend(o);
});

// === Add CSS classes.
on('draw_msg', function (msg) {
  var o = $(msg.dom_id);

  if (msg.is_official)
    o.addClass('official');

  if (msg.is_me)
    o.addClass('me');
console.log(msg, o)
  if (msg.is_error)
    o.addClass('error');

  if (msg.is_official || msg.is_error)
    o.find('div.meta').remove();
});

// === Remove extra messages
on('draw_msg', function (msg) {
  var length = Chat.DOM.find('div.msg').length;
  if (length > Chat.MAX)
    Chat.DOM.find.find('div.msg').last().remove();
});





