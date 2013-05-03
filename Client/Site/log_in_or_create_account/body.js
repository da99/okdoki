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

  function publish_im(data) {
    var div = $('<div class="box"><div class="content"></div></div>');
    div.find('div.content').text(data.body);
    var BOX = $('#IMs');
    BOX.prepend(div);
    if ($('#IMs div.box').length > 10) {
      $('#IMs div.box').last().remove();
      log('removed last');
    }
  }

  function read_ims() {
    log('Getting more ims...');
    promise.get('/IMs', {}, {'Accept': 'application/json' }).then(function (err, result) {
      if (err) {
        log('HTTP GET AJAX error: ', err, result);
        return;
      }
      var obj = JSON.parse(result);
      _.each(obj.ims, function (im) {
        publish_im(im);
      });
      setTimeout(read_ims, 3000);
    });
  }

  read_ims();



}); // $(function) ======================================






