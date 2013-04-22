"use strict";

$(function () {

  var hide_forms = function () {
    $('#forms').hide();
  };

  var reset_forms = function () {
    $('#forms form').hide();
    $('#forms a').removeClass("selected");
    return false;
  };

  var show_form = function ( name ) {
    reset_forms();

    // show
    $('#' + name).show();
    $('#forms a.' + name).addClass("selected");
    return false;
  }

  $('#forms a.sign_in').click( func(show_form, 'sign_in'));
  $('#forms a.create_account').click( func(show_form, 'create_account'));

  $('#forms a.cancel').click(reset_forms);
  $('#forms button.submit').click(submit);

  App.on('submit:sign_in', function () {
    hide_forms();
  });

  return;
  Forms.Submit_Button('#submit_form_create_screen_name', {
    after_success: function (o) {
      if (!o.screen_name)
        return false;

      var new_path = '/info/' + o.screen_name + '/';
      var new_loc = window.location.protocol + '//' + window.location.host + new_path;

      // Add screen name to list:
      var li = $('<li></li>');
      var a  = $('<a></a>');
      a.attr('href', new_path);
      li.append(a);
      $('#homepages div.body ul').append(li);
      document.location.href = new_loc;
    }
  });

  Forms.Submit_Button('#submit_form_sign_in', {
    after_success: function () {
      window.location.reload();
    }
  });

  Forms.Submit_Button('#submit_form_create_account', {
    after_success: function () {
      window.location.reload();
    }
  });



}); // $(function) ======================================






