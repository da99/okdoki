"use strict";

$(function () {


  $('#show_sign_in a').click(function (e) {
    e.preventDefault();
    $('#show_sign_in').hide();
    $('#sign_in').show();
  });

  $('#sign_in a.cancel').click(function (e) {
    e.preventDefault();
    $('#show_sign_in').show();
    $('#sign_in').hide();
  });

  Forms.Submit_Button('submit_form_sign_in');
  Forms.Submit_Button('submit_form_create_account', {
    after_success: function () {
      window.location.reload();
    }
  });

}); // $(function)
