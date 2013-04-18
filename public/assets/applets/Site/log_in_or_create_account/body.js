"use strict";

$(function () {
  $('#forms a.sign_in').click(function (e) {
    e.preventDefault();
    $('#forms form').hide();
    $('#sign_in').show();
    $('#forms a').removeClass("selected");
    $(this).addClass("selected");
  });

  $('#forms a.create_account').click(function (e) {
    e.preventDefault();
    $('#forms form').hide();
    $('#create_account').show();
    $('#forms a').removeClass("selected");
    $(this).addClass("selected");
  });

  $('#forms a.cancel').click(function (e) {
    e.preventDefault();
    $('#forms form').hide();
    $('#forms a').removeClass("selected");
  });

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


  var i = 0;
  Sammy('span.or', function () {
    this.get('/', function () {
      this.$element().html('Hiya buddy: '  + (++i) + '<a href="#/lifes">go</a>');
    });
    this.get('#/lifes', function () {
      this.$element().html('Hiya buddy, again: '  + (++i));
    });
  }).run();


}); // $(function) ======================================






