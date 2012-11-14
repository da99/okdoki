"use strict";
// http://okdoki-disk-drive-shopper.herokuapp.com:80/

var ALL_MSGS = $('#messages');
var MSGS     = $('#messages #msgs');
var NOTIFYS  = $('#messages #notifys');

var MSG        = 'msg';
var STATUS_MSG = 'status_msg';
var ERROR_MSG  = 'error_msg';

var page        = 'http://localhost:80/';
var msg_count   = 0;
var errors_403  = 0;
var err_count   = 0;
var err_showing = true;
var msg_limit   = 250;
var is_dev    = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) > -1;
var ignore_text = ';-)~ Type here.';
var last_time   = (new Date()).getTime();

$(function () {

  if (is_dev) {
    log('Using dev values.');
    msg_limit   = 6;
    setTimeout(function () { flash($('#bots-o ul li:first-child')); }, 1500);
  }


  var create_msg = $('#create_msg');
  var textarea   = create_msg.children('textarea');

  textarea.click(function () {
    if (textarea.val() === ignore_text) {
      textarea.val('');
    }
    textarea.removeClass('blur_ed');
  });

  textarea.blur(function () {
    textarea.addClass('blur_ed');
    if ($.trim(textarea.val()) === '') {
      textarea.val(ignore_text);
    }
  });

  create_msg.children('button.submit').click(function () {
    run_command(textarea.val());
  });

  publish_notify('Loading...', 'loading ' + STATUS_MSG);
  load_or_reload_bots();
  setTimeout(call_ajax, 1000);

});

// ======================================================================
// ======================================================================
// ======================================================================

function ajax_success(resp, stat) {

  if (resp.success) {

    errors_403 = 0;
    err_count  = 0;
    if (resp.notify)
      publish_notify(resp.msg);
    else
      publish_msg(resp.msg);

  } else {

    if (resp.msg === 'Error: Forbidden') {
      if (resp._csrf) {
        $('#csrf_token').val(resp._csrf);
        log('Updating token.');
      } else {
        log(this, resp);
      }
    } else {
      log(this, resp);
    }

  }

  var refresh = 1.5;
  if (resp.refresh)
    refresh = parseFloat(resp.refresh);
  if (refresh < 1.5)
    refresh = 1.5;

  last_time = (new Date()).getTime();
  setTimeout(call_ajax, ( refresh * 1000));
  log("Refreshing in: " + refresh + " seconds.");

} // === func ajax_success

function ajax_error(xhr, textStatus, errorThrown) {

  var retry_in = (is_dev ? 1.5 : 30);

  if (textStatus === 'error' && !errorThrown) {
    log("Retrying in " + retry_in + " seconds. Website appears to be down for a moment. Time: " + (new Date()).getSeconds());
  } else {
    log("Retrying in " + retry_in + " seconds. Error msg: " + textStatus + " Error: " + errorThrown);
  }

  setTimeout(call_ajax, (retry_in * 1000));
}

function default_ajax_options(request_type, succ, err) {
  return {
    type     : 'POST',
    url      : window.location.origin + "/ask",
    cache    : false,
    data     : {is_dev : is_dev, 'request_type': request_type, '_csrf': $('#csrf_token').val()},
    dataType : 'json',
    success  : (succ || ajax_success),
    error    : (err  || ajax_error)
  };
}



function call_ajax() {
  $.ajax(default_ajax_options('latest msgs'));
}

function create_msg_ele(msg, css) {
  if (css) {
    css = " " + css;
  } else
    css = '';
  var ele = $("<div></div>", { 'class' : MSG + css });
  ele.html(_.escape(msg));
  return ele;
}

function append_msg(msg, css) {
  MSGS.append(create_msg_ele(msg, css));
}

function prepend_msg(msg, css) {
  MSGS.prepend(create_msg_ele(msg, css));
}

function remove_old_msg(raw_num) {
  var num = (!raw_num) ? 1 : raw_num;
  var css = "old_msg_deleted";
  var full_css = css + " " + STATUS_MSG;
  MSGS.children('div.' + css).remove();

  if (msg_count > msg_limit) {
    MSGS.children('div.' + MSG).remove('div:last-child');
    if (msg_count === (msg_limit + 1)) {
      append_msg("1 old message deleted.", full_css);
    } else {
      append_msg((msg_count - msg_limit) + " old messages deleted.", full_css);
    }
  }
} // === remove_old_msg

function publish_msg(msg, css) {
  remove_old_notifys();
  ++msg_count;
  remove_old_msg();
  prepend_msg(msg, css);
} // === function


// ====================================================================
// ================== NOTIFYS =========================================
// ====================================================================

function remove_old_notifys() {
  NOTIFYS.children('div.loading').remove();
}

function publish_notify(msg, css) {
  remove_old_notifys();
  NOTIFYS.prepend(create_msg_ele(msg, css));
} // === function


// ====================================================================

function log() {
  if (console && console.log) {
    $.each(_.toArray(arguments), function (i, msg) {
      console.log(msg);
    });
    return true;
  }

  return false;
}


function flash(target) {
  target.effect('highlight', {}, 3000);
}


function load_or_reload_bots() {
  $.ajax(default_ajax_options('bots list', ajax_success_bots_list, function () { log("bots list err"); }));
}

function ajax_success_bots_list(msg, stat, opts) {
  if (!msg.success) {
    log("Error in getting bots list:", msg, stat, opts);
    return false;
  }

  log("loaded bots list", msg);
  return true;

  var list = _.clone(msg.list);
  var already_added = {};
  var name = null;
  var new_li = null;

  var dom = $('#bots-o ul li, #bots-x ul li');
  dom.each(function (ele, i) {
    name = $(ele).text();
    if (!list[name]) {
      $(ele).remove();
    } else {
      already_added[name] = true;
    }
  });

  $.each(list, function (ind, val) {

    if (already_added[ind]) {
      return true;
    }

    new_li = $('<li></li>');
    new_li.html(_.escape(ind));
    $('#bots-x ul').prepend(new_li);

  });

}

function run_command(txt) {
  alert(txt);
  return true;
}

// =========================================================

function turn_on_bot() { }
function turn_off_bot() {}
function nap_time_for_bot() { }
function info_on_bot() {}

var cmds = {

  'RELOAD BOTS LIST' : {
    'func'    : load_or_reload_bots
  },

  '@ YOU MAY LIVE':  {
    'func'    : turn_on_bot
  },

  '@ DROP DEAD' : {
    'func'    : turn_off_bot
  },

  '@ TAKE A NAP' : {
    'func'    : nap_time_for_bot
  },

  '@ I NEED HELP' : {
    'aliases' : [],
    'func'    : info_on_bot
  }

};

