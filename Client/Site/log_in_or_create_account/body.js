"use strict";

$(function () {

  // ================================================================
  // ================== Helpers =====================================
  // ================================================================

  var sidebar = $('#sidebar');
  var The_Box = $('#content');


  // ================================================================
  // ================== EVENTS ======================================
  // ================================================================

  on('read:screen_name', function (data) {
    console.log('read screen name', data.screen_name);
  });

  on('submit:sign_in', function () {
    hide_forms();
    The_Box.show();
    var html = $('#lifes').html();
    The_Box.append(Listenize(html, {
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


  var demo_func = function (f) {

    f.on_success(function (data) {

      log('success');
      window.location.href = '/me/' + f.find('input').val();
      return true;

      create_unless('#screen_names') .in(sidebar, function () {
        $('#screen_names div.content')
        .text('dEmO_' + $('#sign_in div.screen_name input').val() + '_' + $('#create_account div.screen_name input').val());
      });

      create_unless('#Write') .in(sidebar, function () {
        $('#Write button.submit').click(function () {
          log('Post button clicked.');
          $('#Write textarea').text((parseInt(Math.random() * 200)) + ' ::: ' + $($('#IMs div.box div.content')[parseInt(Math.random() * 3)]).text());
          return false;
        });
      });

      create_unless('#IMs') .in(The_Box);

      trigger('read:screen_name', data);
      read_ims();
    });

    f.on_invalid(function (data) {
      console.log('invalid', data);
    });

  };

  form('#sign_in', demo_func);
  form('#create_account', function (f) {
    f.on_success(function (result) {
      reset_forms(f);
      f.find('div.buttons').after(compile_template('div.screen_name_created', {HREF: result.location}));
      log(result);
      document.location.href = result.location;
    });
  });

  function publish_im(data) {
    var div = $('<div class="box"><div class="content"></div></div>');
    div.find('div.content').text(data.body);
    var BOX = $('#IMs');
    BOX.prepend(div);
    div.addClass('highlight_up');
    setTimeout(function () {
      div.addClass('highlight_down');
    }, 100);
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



}); // $(function) ======================================






