"use strict";
// http://okdoki-disk-drive-shopper.herokuapp.com:80/

var ALL_MSGS  = $('#messages');
var MSGS      = $('#messages #msgs');
var NOTIFYS   = $('#messages #notifys');
var OKDOKI    = "@okdoki";
var to_okdoki = 0;

var MSG        = 'msg';
var STATUS_MSG = 'status_msg';
var ERROR_MSG  = 'error_msg';

var page        = 'http://localhost:80/';
var errors_403  = 0;
var err_count   = 0;
var err_showing = true;
var msg_limit   = 250;
var is_dev    = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) > -1;
var ignore_text = ';-)~ Type here.';
var last_time   = (new Date()).getTime();
var max_msg_date = (new Date).getTime() - (1000 * 10);

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

  // textarea.blur(function () {
    // textarea.addClass('blur_ed');
    // if ($.trim(textarea.val()) === '') {
      // textarea.val(ignore_text);
    // }
  // });

  create_msg.children('button.submit').click(function () {
    var cmd = textarea.val();
    create_msg.children('textarea').val("");
    // create_msg.children('textarea').blur();
    run_command(cmd);
  });

  publish_msg(OKDOKI + " Welcome. Please wait as I get the latest messages.", STATUS_MSG);
  // load_or_reload_bots();
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
    data     : {date: (max_msg_date || (new Date).getTime() ), is_dev : is_dev, 'request_type': request_type, '_csrf': $('#csrf_token').val()},
    dataType : 'json',
    success  : (succ || ajax_success),
    error    : (err  || ajax_error)
  };
}


function call_ajax() {
  $.ajax(default_ajax_options('latest msgs'));
}

function create_msg_ele(raw_msg, css) {
  var id, msg;

  if (raw_msg.substr) {
    msg = raw_msg;
  } else {
    msg = raw_msg.msg;
    id  = "msg" + (raw_msg.id || (new Date).getTime());
    if ( raw_msg.date ) {
      if (!max_msg_date || max_msg_date < raw_msg.date)
        max_msg_date = raw_msg.date
    }
  }

  if (css) {
    css = " " + css;
  } else
    css = '';
  var ele = $("<div></div>", { 'class': MSG + ' '  + css, id: id});
  ele.html(_.escape(msg));
  return ele;
}

function attach_msg(func, ele) {
  if (ele.attr('id') && $('#' + ele.attr('id')).length > 0 ) {
    return false;
  } else {
    MSGS[func](ele);
  }
}

function append_msg(msg, css) {
  attach_msg('append', create_msg_ele(msg, css));
}

function prepend_msg(msg, css) {
  attach_msg('prepend', create_msg_ele(msg, css));
}

function remove_old_msg() {
  var css = "old_msg_deleted";
  var full_css = css + " " + STATUS_MSG;
  MSGS.children('div.' + css).remove();
  var msg_count = MSGS.children('div.' + MSG).length;

  if (msg_count > msg_limit) {
    if (msg_count === (msg_limit + 1)) {
      append_msg(OKDOKI + " I deleted 1 old message.", full_css);
    } else {
      append_msg(OKDOKI + " I deleted " + (msg_count - msg_limit) + " old messages deleted.", full_css);
    }
  }
} // === remove_old_msg

function publish_msg(msg, css) {
  remove_old_notifys();
  remove_old_msg();

  if (msg.pop) {
    if (msg.length == 0) {
      log("No new messages.");
    } else {
      var msgs = msg.slice();
      while(msgs.length) {
        publish_msg(msgs[0]);
        msgs.shift();
      }
    }
  } else {
    prepend_msg(msg, css);
  }
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

  if($.trim(txt).indexOf("As @") === 0) {
    txt = txt.replace("As @", "");
    var author = txt.substr(0, txt.indexOf(" ") );
    txt = $.trim(txt.replace(author, ""));
    var opts = default_ajax_options("save msg");
    opts.data.msg = txt;
    opts.data.author = author;
    $.ajax(opts);
    return true;

  } else {

    publish_msg(txt);

    if($.trim(txt).indexOf(OKDOKI) === 0) {
      ++to_okdoki;
      setTimeout( function () {
        if (to_okdoki < 2 )
          publish_msg(OKDOKI + " Unfortunately, I am not fully developed. I have no idea what you just said.");
        else if (to_okdoki < 5)
          publish_msg(OKDOKI + " Again... no idea what you just said.");
        else
          publish_msg(OKDOKI + " What part of, \"no idea what you just said\", don't you understand?!");
      }, 1000);
    }

  }

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

