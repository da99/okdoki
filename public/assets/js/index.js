
$(function() {

  var socket        = ('http://okdoki-disk-drive-shopper.herokuapp.com:80/');
  var page          = 'http://localhost:80/';
  var msg_count     = 0;
  var msg_css_class = 'msg';
  var errors_403    = 0;
  var err_count     = 0;
  var err_showing   = true;
  var msg_limit     = 250;
  var err_limit     = 25;
  var is_local      = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) > -1 ;
  var ignore_text   = ';-)~ Type here.';

  if(is_local) {
    var msg_limit   = 3;
    var err_limit   = 3;
  };


  var last_time = (new Date()).getTime();
  var dom_target = $('#messages');

  function log(msg) {
    if(console && console.log) {
      console.log( msg );
      return true;
    };

    return false;
  };

  function ajax_success (msg, stat) {
    var data = msg.msg;

    if(msg.success) {

      errors_403 = 0;
      err_count  = 0;
      publish_msg( data );

    } else {

      if(data == 'Error: Forbidden') {
        if(msg._csrf) {
          $('#csrf_token').val(msg._csrf);
          log('Updating token.');
        } else {
          if (++errors_403 > err_limit) {
            publish_msg( "Unknown error. Trying 'Refresh'-ing this page.", true );
            log(msg.msg);
            errors_403 = 0;
          };
        };
      } else {
        log( "Error: " + data );
      };

    };

    last_time = (new Date()).getTime();
    setTimeout(call_ajax, (1.5 * 1000));

  }; // === func ajax_success

  function ajax_error (xhr, textStatus, errorThrown) {
    if (++err_count > err_limit) {
      publish_msg( "Unknown error. Trying 'Refresh'-ing this page.", true);
      err_count = 0;
    };

    if(textStatus == 'error' && !errorThrown) {
      log( "Retrying in 5 seconds. Website appears to be down for a moment.");
    } else {
      log( "Retrying in 5 seconds. Error msg: " + textStatus + " Error: " + errorThrown);
    };

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

  function publish_msg(msg, err_msg) {
    if(err_msg) {
      if(err_showing == msg)
        return false;
      err_showing = msg;
    } else {
      err_showing = false;
    };

    ++msg_count;
    remove_old_msg();
    prepend_msg(msg);
  };

  function call_ajax() {
    $.ajax({
      type     : 'POST',
      url      : window.location.origin + "/ask",
      cache    : false,
      data     : {'request_type':'latest msgs', '_csrf': $('#csrf_token').val()},
      dataType : 'json',
      success  : ajax_success,
      error    : ajax_error
    });
  };

  function run_command(txt) {
    alert(txt);
    return true;
  };

  var create_msg = $('#create_msg');
  var textarea   = create_msg.children('textarea');

  textarea.click(function() {
    if(textarea.val() == ignore_text) {
      textarea.val('');
    };
    textarea.removeClass('blur_ed');
  });

  textarea.blur(function () {
    textarea.addClass('blur_ed');
    if( $.trim(textarea.val()) == '' )
      textarea.val(ignore_text);
  });

  create_msg.children('button.submit').click(function() {
    run_command(textarea.val());
  });

  call_ajax();

});
