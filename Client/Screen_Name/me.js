
var Control_Panel = $('#Control_Panel');

// ================== Screen Name ==============

function me_mb_msg(o) {
  $('#Message_Board').find('div.msgs').prepend( compile_template('div.me_msg', o) );
}


function mb_msg(o) {
  var sn = Screen_Name.screen_name().toUpperCase();
  if (_.isArray(o)) {
    _.each(o.slice().reverse(), function (m) {

  log(m)
      if (m.author_screen_name.toUpperCase() === sn)
        me_mb_msg(m);
      else
        mb_msg(m);
    });
    return false;
  }

  $('#Message_Board').find('div.msgs').prepend( compile_template('div.msg', o) );
}

function screen_name(name) {

  if (!name) {
    return Screen_Name.screen_name();
  }

  var parent = $('#Other_Screen_Names');
  var li = $('<li><a href=""></a></li>');
  li.find('a').attr('href', "/me/" + name);
  li.find('a').text(name);

  parent.find('ul').prepend(li);
  parent.show();
}

function folder(f) {
  var parent = $('#Folders ul.folders');
  parent.prepend(compile_template('li.folder', f));
  parent.show();
}

$(function () {

  toggles("#Message_Board div.show_write a", "#Write_Message a.cancel");

  // ============================================
  // ================ Show lifes.................
  // ============================================
  if (Customer.is_owner_of_screen_name) {
    var lifes = Customer.screen_names();
    var SN = Screen_Name.screen_name().toUpperCase();

    _.each(lifes, function (l) {
      if (SN != l.toUpperCase())
        screen_name(l);
    });

    if (Customer.has_one_life) {
      Control_Panel.hide();
    }
  }


  // ============================================
  // ================ Create life................
  // ============================================
  if ($('#New_Life').length)
    form('#Create_Screen_Name', function (f) {
      f.at_least_one_not_empty('input[name="screen_name"]');
      f.on_success(function (result) {
        Control_Panel.show();
        f.find('div.success').html('Your new life is at: <a href="/me/SN">okdoki.com/me/SN</a>'.replace(/SN/g, result.screen_name));
        screen_name(result.screen_name);
      });
    });

  // ============================================
  // ================ Post a message board msg...
  // ============================================
  form('#Write_Message', function (f) {
    f.at_least_one_not_empty('textarea');
    f.on_success(function (result) {
      f.find('div.success').hide();
      me_mb_msg(result.mb_msg);
      f.find('a.cancel').click();
    });
  });

  // ============================================
  // ================ Grab message board msgs....
  // ============================================
  get('/me/' + Screen_Name.screen_name() + '/message_board/msgs' , function (err, o) {
    var div_loading = $('#Message_Board div.msgs div.loading');

    if (err) {
      log(err);
      div_loading.addClass('error_msg');
      div_loading.removeClass('loading');
      div_loading.text("Messages could not be retrieved at this time. Try again later by refreshing this page.");
      return false;
    }

    div_loading.remove();
    mb_msg(o.list);
  });

  // ============================================
  // ================ Create Folder..............
  // ============================================
  form('#Create_Folder', function (f) {
    f.at_least_one_not_empty('input[type="text"]');
    f.on_success(function (result) {
      result.location = Screen_Name.to_url('/folder/' + result.num);
      f.find('div.success').html("New folder is at: <a href=\"LOC\">LOC</a>".replace(/LOC/g, result.location));
      log(result)
      folder(result);
    });
  });



}); // ==== jquery on dom ready















