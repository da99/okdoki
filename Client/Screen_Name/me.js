
var Show_Say           = $('#Write_To_Chat_Room');
var IN_CHAT_ROOM       = false;
var LAST_CHAT_MSG_DATE = null;
var MAX_CHAT_MSG_TOTAL = 250;
var TOTAL_CHAT_MSG     = 0;

function official_chat_msg(msg) {
  draw_chat_msg( 'div.official.chat_msg', msg );
}

function official_error_chat_msg(msg) {
  draw_chat_msg( 'div.official.chat_msg.error_msg', msg );
}

function me_mb_msg(o) {
  $('#Message_Board').find('div.msgs').prepend( compile_template('div.me_msg', o) );
}

function mb_msg(o) {
  if (_.isArray(o)) {
    _.each(o.slice().reverse(), function (m) {
      mb_msg(m);
    });
    return false;
  }

  $('#Message_Board').find('div.msgs').prepend( compile_template('div.msg', o) );
}


function me_chat_msg(msg) {
  draw_chat_msg( 'div.me_chat_msg', msg );
}

function chat_msg(msg) {
  draw_chat_msg( 'div.chat_msg', msg );
}

function draw_chat_msg(sel, msg) {
  TOTAL_CHAT_MSG += 1;
  $('#Chat_Msgs').prepend( compile_template(sel, msg) );
  if (TOTAL_CHAT_MSG > MAX_CHAT_MSG_TOTAL) {
    $('#Chat_Msgs').find('div.chat_msg').last().remove();
  }
}

function screen_name(name) {
  var parent = $('#Other_Screen_Names');
  var li = $('<li><a href=""></a></li>');
  li.find('a').attr('href', "/me/" + name);
  li.find('a').text(name);

  parent.find('ul').prepend(li);
  parent.show();
}

function folder(f) {
  var parent = $('#Folders ul.folders');
  var li = $('<li><a href=""></a></li>');
  li.find('a').attr('href', f.location);
  li.find('a').text(f.title);

  parent.prepend(li);
  parent.show();
}

$(function () {

  toggles("#Message_Board div.show_write a", "#Write_Message a.cancel");

  // ============================================
  // ================ Show lifes.................
  // ============================================
  if ($('#Other_Screen_Names').length) {
    var lifes = $.trim($(read_template('div.screen_names')).text()).split(/\s+/);
    var SN = $.trim($(read_template('div.screen_name')).text()).toUpperCase();

    _.each(lifes, function (l) {
      if (SN != l.toUpperCase())
        screen_name(l);
    });
  }

  // ============================================
  // ================ Create life................
  // ============================================
  if ($('#New_Life').length)
    form('#Create_Screen_Name', function (f) {
      f.at_least_one_not_empty('input[name="screen_name"]');
      f.on_success(function (result) {
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
  get('/message_board/msgs', function (err, o) {
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
  // ================ Grab chat room msgs........
  // ============================================
  every_secs(2, function () {
    if ( !IN_CHAT_ROOM )
      return false;
    post("/chat_room/msgs", {after: LAST_CHAT_MSG_DATE}, function (err, o) {
      if (err) {
        log(err);
        return false;
      }
      _.each(o.list, function (m) {
        chat_msg(m);
      });
    });
  });

  // ============================================
  // ================ ENTER The Chat Room........
  // ============================================
  on_click("#Enter_Chat_Room a", function (e) {
    $('#Enter_Chat_Room div.error_msg').hide();
    swap_display('#Home_Page', '#Chat_Room');
    official_chat_msg({
      body: "Entering chat room... please wait..."
    });

    // Enter the Chat Room...
    post("/chat_room/enter", {}, function (err, o) {
      IN_CHAT_ROOM = false;
      if (err) {
        log(err);
        in_secs(5, function () {
          official_error_chat_msg({body: "Your attempt to enter the chat room failed."});
          $('#Home_Page').show();
          $('#Chat_Room').hide();
          $('#Enter_Chat_Room div.error_msg').text('Your attempt to enter the chat room failed. Try again in a few minutes.');
          $('#Enter_Chat_Room div.error_msg').show();
        });
        return false;
      }

      IN_CHAT_ROOM = true;
      Show_Say.show();
      $('#Enter_Chat_Room div.error_msg').hide();
      official_chat_msg({body: o.msg});
    });

    return false;
  });

  // ============================================
  // ================ Talk to the Chat Room......
  // ============================================
  form('#Write_To_Chat_Room', function (f) {
    f.at_least_one_not_empty('textarea');
    f.on_success(function (result) {
      f.find('div.success').hide();
      me_chat_msg(result.chat_msg);
    });
  });

  // ============================================
  // ================ LEAVE The Chat Room........
  // ============================================
  on_click("#Leave_Chat_Room a", function (e) {
    IN_CHAT_ROOM = false;
    Show_Say.hide();
    swap_display('#Home_Page', '#Chat_Room');
    official_chat_msg({
      body: "Sending message that you are leaving..."
    });

    post("/chat_room/leave", {}, function (err, msg) {
      if (err) {
        log(err);
        return false;
      }

      official_chat_msg({body: msg.msg || "You are now OUT of the chat room."});
    });
    return false;
  });

  // ============================================
  // ================ Create Folder..............
  // ============================================
  form('#Create_Folder', function (f) {
    f.at_least_one_not_empty('input[type="text"]');
    f.on_success(function (result) {
      f.find('div.success').html("New folder is at: <a href=\"LOC\">LOC</a>".replace(/LOC/g, result.location));
      log(result)
      folder(result);
    });
  });


}); // ==== jquery on dom ready










// ========= OLD CODE =================
//
  // form('#Create_Folder form', function (f) {
    // f.on_success(function (result) {
      // log(result);
      // var new_folder = compile_template('div.folder', {'TITLE': result.name, 'LOCATION': result.location});
      // $('div.boxs').prepend(new_folder);
    // });

    // var path          = window.location.pathname;
    // var parent        = $(this).parent();
    // var orig_text     = $(this).text();
    // var link          = $(this);
    // var id            = 'create_folder_loading' ;
    // var ele           = $('<div class="loading ' + id + '">Processing...</div>');

    // $(this).after(ele);
    // $(this).hide();

    // post((path + '/create/folder').replace('//', '/'), function (err, results) {
      // ele.remove();

      // if (err) {

        // log(err, results);

        // var err_id = 'create_folder_error';
        // var min_15  = (1000 * 60 * 15);
        // link.after($('<div class="errors ' + err_id + '">Error occurred. Try again in...</div>'));
        // every_sec($(parent).find('div.' + err_id), function (target, since) {
          // if (since > min_15) {
            // link.show();
            // target.remove();
            // return;
          // }
          // target.text('Error occurred. Try again in ' + min_sec(min_15 - since) + ' mins.');
          // return true;
        // });

        // return;
      // }

      // link.show();
      // var succ = $('<div class="success">Your new folder is at: <a href="HREF">HREF</a></div>'.replace(/HREF/g, results.location));
      // link.after(succ);

    // });

    // log(orig_text);
  // });






