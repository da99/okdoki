"use strict";

$(function () {
  $('#show_sign_in a').click(function (e) {
    e.preventDefault();
    $('#show_sign_in').hide();
    $('#sign_in').css('display', 'block');
  });
});
