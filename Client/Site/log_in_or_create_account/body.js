"use strict";

$(function () {

  // ================================================================
  // ================== Helpers =====================================
  // ================================================================

  var content = $('#content');
  var sidebar = $('#sidebar');

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


  // ================================================================
  // ================== EVENTS ======================================
  // ================================================================

  on('read:screen_name', function (data) {
    console.log('read screen name', data.screen_name);
  });

  on('submit:sign_in', function () {
    hide_forms();
    content.show();
    var html = $('#lifes').html();
    content.append(Listenize(html, {
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

  // ================================================================
  // ================== DOM EVENTS ==================================
  // ================================================================

  on_click('#forms a.show', show_form );
  on_click('#forms a.cancel', reset_forms);

  form('#create_account', function (f) {

    f.on_success(function (data) {

      hide('#forms');

      create_unless('#screen_names')
      .in(sidebar);

      trigger('read:screen_name', data);
    });

    f.on_invalid(function (data) {
      console.log('invalid', data);
    });

  });





}); // $(function) ======================================






