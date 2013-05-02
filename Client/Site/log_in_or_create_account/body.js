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

  var show_form = function ( e ) {
    e.stopPropagation();
    reset_forms();

    // show
    var sel = $(this).attr('href');
    $(sel).show();
    $(this).addClass("selected");
    return false;
  }

  on_click('#forms a.show', show_form );
  on_click('#forms a.cancel', reset_forms);

  on_response('#create_account', function (f) {

    f.on_success(function (data) {
      console.log("success", data);
    });

    f.on_invalid(function (data) {
      console.log('invalid', data);
    });
  });

  App.on('submit:sign_in', function () {
    hide_forms();
    $('#control_center').show();
    var html = $('#lifes').html();
    $('#control_center').append(Listenize(html, {
      publish_tag : function (e) {
        var form = $(this).parents('div.content');
        var span = form.find('span.get_tag');
        var input = form.find('input.tag');
        span.text(input.val());
        return false;
      },
      tags: [{name: 'a', num: 2}, {name: 'b', num: 3}],
      msg: "Hi, from doT"
    }));
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






