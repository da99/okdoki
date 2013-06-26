var Show_Say           = $('#Write_To_Chat_Room');
var IN_CHAT_ROOM       = false;
var LAST_CHAT_MSG_DATE = null;
var MAX_CHAT_MSG_TOTAL = 250;
var TOTAL_CHAT_MSG     = 0;
var Control            = null;
var Chats              = null
var The_Door           = null;
var LOOP               = null;
var SEATS              = {};
var SEAT_LIST          = null;

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
  if (_.isString(msg)) {
    msg = {body: msg}
  }
  TOTAL_CHAT_MSG += 1;
  $('#Chat_Msgs').prepend( compile_template(sel, msg) );
  if (TOTAL_CHAT_MSG > MAX_CHAT_MSG_TOTAL) {
    $('#Chat_Msgs').find('div.chat_msg').last().remove();
  }
}

function chat_seat(o) {
  var seat = SEATS[o.screen_name];
  var name = o.screen_name;
  var is_me = (o.screen_name.toUpperCase() === Screen_Name.screen_name().toUpperCase());
  if (is_me)
    name = '(me) ' + name;

  if (!seat) {
    if (!is_me)
      official_chat_msg("Connected: " + name);
    seat = SEATS[o.screen_name] = {
      name: o.screen_name,
      ele : $('<li><a href="/me/NAME">NAME</a></li>')
    };
    seat.ele.find('a').attr('href', "/me/" + o.screen_name);
    seat.ele.find('a').text(name);
    SEAT_LIST.prepend(seat.ele);
  }

  if (o.is_out) {
    seat.ele.addClass('is_out');
    official_chat_msg("DISconnected: " + name);
  } else {
    if (seat.ele.hasClass('is_out')) {
      seat.ele.detach();
      SEAT_LIST.prepend(seat.ele);
      official_chat_msg("Connected: " + name);
    }
    seat.ele.removeClass('is_out');
  }

  seat.is_out = o.is_out;

  return seat;
} // === chat_seat

function start_loop(max) {
  // ================ Grab chat room msgs........
  if (LOOP)
    return;

  LOOP = true;
  every_secs(max || 3, function () {
    if ( !IN_CHAT_ROOM )
      return false;
    post("/me/" + Screen_Name.screen_name() + "/chat/msgs", {after: LAST_CHAT_MSG_DATE}, function (err, o) {
      if (err) {
        log(err);
        return false;
      }

      _.each(o.msgs, function (m) {
        chat_msg(m);
      });

      _.each(o.seats, function (m) {
        chat_seat(m);
      });
    });
  });
}

function enter_chat_room(fav_sn) {

  reset_chat_room();

  var url = "/me/" + Screen_Name.screen_name() + "/chat/enter";

  if (!fav_sn)
    fav_sn = Customer.fav_screen_name();

  The_Door.show();
  Control.hide();
  Chats.show();

  official_chat_msg({
    body: "Entering chat room... please wait..."
  });

  // Enter the Chat Room...
  post(url, {as_this_life: fav_sn}, function (err, o) {

    Control.show();

    if (err) {
      log("Attempted to enter chat room...");
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

    chat_seat({screen_name: fav_sn});
    start_loop(o.max_time);
  });


} // ==== enter_chat_room

// ================================================================
// ================== Main ========================================
// ================================================================

$(function () {

  The_Door         = $('#The_Door');
  Control          = $('#Boxs');
  Chats            = $('#Chats');
  One_More_Step    = $('#One_More_Step');
  Choose_Life_Form = $('#Choose_Life');
  SEAT_LIST        = $('#Seat_List');

  // ================== Window Resize ===============================
  $(window).resize(function () {
    $('textarea').css('width', '95%');
  });


  // ================================================================
  // ===== When a stranger trys to enter:
  // ================================================================

  $('#Stranger a[href="/"]').click(function (e) {
    var link = $(e);
    $.cookie('url_wanted', 'chat room of: ' + Screen_Name.screen_name(), {
      expires: new Date((new Date).getTime() + (1000 * 60 * 15)),
      path: "/"
    });
    return true;
  });

  if (Customer.is_stranger)
    return;

  // ================================================================
  // ================== For Customers:
  // ================================================================

  if (Customer.is_owner_of_screen_name) {
    enter_chat_room(Screen_Name.screen_name());
  } else {
    if (Customer.has_one_life)
      enter_chat_room(Customer.fav_screen_name());
    else {
      log("Waiting for you to pick name.");
    }
  }

  on_click(Choose_Life_Form.find('button.submit'), function (e) {
    Customer.fav_screen_name( Choose_Life_Form.find('input[name="as_this_life"]').val() );
    log(Customer.fav_screen_name());
    One_More_Step.hide();
    enter_chat_room(Customer.fav_screen_name());
  });

  // ================ Talk to the Chat Room......
  form('#Write_To_Chat_Room', function (f) {
    f.at_least_one_not_empty('textarea');
    f.on_success(function (result) {
      f.find('div.success').hide();
      me_chat_msg(result.chat_msg);
    });
  });

  // ================ LEAVE The Chat Room........
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


}); // ==== jquery on dom ready

















