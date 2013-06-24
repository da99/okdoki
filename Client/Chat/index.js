var Show_Say           = $('#Write_To_Chat_Room');
var IN_CHAT_ROOM       = false;
var LAST_CHAT_MSG_DATE = null;
var MAX_CHAT_MSG_TOTAL = 250;
var TOTAL_CHAT_MSG     = 0;
var IS_CUSTOMER        = false;
var Control = null;
var Chats = null
var The_Door = null;

function reset_chat_room() {
  IN_CHAT_ROOM = false;
}

function official_chat_msg(msg) {
  draw_chat_msg( 'div.official.chat_msg', msg );
}

function official_error_chat_msg(msg) {
  draw_chat_msg( 'div.official.chat_msg.error_msg', msg );
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

function enter_chat_room() {
  The_Door.show();
  Control.hide();
  Chats.show();

  official_chat_msg({
    body: "Entering chat room... please wait..."
  });

  // Enter the Chat Room...
  post("/chat_room/enter", {}, function (err, o) {

    reset_chat_room();
    Control.show();

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
}

// ================================================================
// ================== Main ========================================
// ================================================================

$(function () {

  The_Door = $('#The_Door');
  Control  =  $('#Boxs');
  Chats    = $('#Chats');

  IS_CUSTOMER = $('body').hasClass('is_customer');

  $('#Stranger a[href="/"]').click(function (e) {
    var link = $(e);
    $.cookie('url_wanted', 'chat room of: ' + Screen_Name.screen_name(), {
      expires: new Date((new Date).getTime() + (1000 * 60 * 15)),
      path: "/"
    });
    return true;
  });

  if (!IS_CUSTOMER)
    return;

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

  // ================================================================
  // ================== Window Resize ===============================
  // ================================================================
  $(window).resize(function () {
    $('textarea').css('width', '95%');
  });

  // ============================================
  // ================ ENTER The Chat Room........
  // ============================================
  if (Customer.has_one_life()) {
    enter_chat_room();
  }


}); // ==== jquery on dom ready

















