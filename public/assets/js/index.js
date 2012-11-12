
$(function() {

  var socket = ('http://okdoki-disk-drive-shopper.herokuapp.com:80/');
  var page = 'http://localhost:80/';
  var msg_count = 0;
  var msg_limit = 3;
  var msg_css_class = 'msg';


  var last_time = (new Date()).getTime();
  var dom_target = $('#messages');

  function ajax_success (data, stat) {
    publish_msg( data + ' - ' + ( (parseInt( data.split(' ').pop() ) - last_time) / 1000 ) );
    last_time = (new Date()).getTime();
    setTimeout(call_ajax, (1.5 * 1000));
  };

  function ajax_error (xhr, textStatus, errorThrown) {
    publish_msg( "Retrying in 5 seconds. Error: " + textStatus + " " + errorThrown);
    setTimeout(call_ajax, (5 * 1000));
  };

  function append_publish_msg() {
    dom_target.html( dom_target.html() + "<div class='msg'>" + _.escape(msg) + '</div>' );
  };

  function remove_old_msg(raw_num) {
    if(!raw_num)
      var num = 1;
    else
      var num = raw_num;

    if(msg_count > msg_limit) {
      if(msg_count == (msg_limit + 1)) {
        dom_target.children('div').remove('div:last-child');
        append_msg("1 old message deleted", "append");
      } else {
        dom_target.children('div').remove('div:last-child');
        dom_target.children('div').remove('div:last-child');
        append_msg( (msg_count - msg_limit ) + " old messages deleted", "append");
      };
    };
  }; // === remove_old_msg

  function create_msg_ele(msg) {
    var new_ele = "<div class='" + msg_css_class + "'>" + _.escape(msg) + '</div>';
    return new_ele;
  };

  function append_msg(msg) {
    dom_target.html( dom_target.html() + create_msg_ele(msg) );
  };

  function prepend_msg(msg) {
    dom_target.html( create_msg_ele(msg) + dom_target.html() );
  };

  function publish_msg(msg, append) {
    ++msg_count;
    remove_old_msg();
    prepend_msg(msg);
  };

  function call_ajax() {
    $.ajax({
      type     : 'POST',
      url      : "http://localhost:5000/ask",
      cache    : false,
      data     : {'request_type':'latest msgs', '_csrf': $('#csrf_token').val()},
      dataType : 'text',
      success  : ajax_success,
      error    : ajax_error
    });
  };

  function run_command(txt) {
    alert(txt);
    return true;
  };

  var create_msg = $('#create_msg');
  create_msg.children('button.submit').click(function() {
    run_command($('#create_msg').children('textarea').val());
  });
  call_ajax();


});
