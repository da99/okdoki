"use strict";

var old_err   = window.onerror;
var APP_ERROR = false;

window.onerror = function (errorMsg, url, lineNumber) {
  if (old_err)
    return old_err.apply(null, arguments);

  if (window.$) {
    var o = $('<div/>');
    o.addClass('APP_ERROR');
    o.text("Unexpected error. Refresh this page.");
    $('body').prepend(o);
    window.scrollTo(0, 0);
  }

  if (console && console.log)
    console.log(arguments);

  APP_ERROR = arguments[0] || "unknown";
  return false;
};


function attach_console_link_click(e) {
  var href = $(e).attr('href');
  if (href.indexOf('/log') > -1 || href.indexOf('#') > -1 )
    return;

  on_click(e, function () {
    var o = $(this);
    if (Customer_Lifes.in_chat_rooms.length)
      window.open(o.attr('href'), '_blank');
    else
      window.location.href = o.attr('href');
  });

}

function show_option(e) {
  var parent = $(this).parents('div.box');
  parent.find('div.content').show();
  $(this).hide();
  $(parent.find('a.off')[0]).show();
}

function hide_option(e) {
  var parent = $(this).parents('div.box');
  parent.find('div.content').hide();
  $(this).hide();
  $(parent.find('a.on')[0]).show();
}

// ================ ON LOAD ======================
$(function () {
  $('a').each(function (i, e) {
    attach_console_link_click(e);
  });

  $('#Options a.on').each(function (i, l) {
    on_click(l, show_option);
  });

  $('#Options a.off').each(function (i, l) {
    on_click(l, hide_option);
  });
});

on('template compiled' , function (o) {
  $(o.dom).find('a').each(function (i, e) {
    attach_console_link_click(e);
  });
});


// === When to open links in a new window.
var Customer_Lifes = {
  in_chat_rooms : []
};

on('after enter chat room', function () {
  Customer_Lifes.in_chat_rooms.push(1);
});

on('after leave chat room', function () {
  Customer_Lifes.in_chat_rooms.pop();
});




