
var Show_Say = $('#Chat_Room div.show_say');

function official_chat_msg(msg) {
  $('#Chat_Msgs').prepend( compile_template('div.official.chat_msg', msg));
}

function official_error_chat_msg(msg) {
  $('#Chat_Msgs').prepend( compile_template('div.official.chat_msg.error_msg', msg));
}

function chat_msg(msg) {
  $('#Chat_Msgs').prepend( compile_template('div.chat_msg', msg));
}

$(function () {

  toggles("#Chit_Chat div.show_write a", "#Write_Message a.cancel");
  toggles("div.show_say a", "#Write_To_Chat_Room a.cancel");

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
    f.on_success(function (result) {
      f.find('div.success').hide();
      var m = result.chat_msg;
      m.author_screen_name = m.author_screen_name + ' (me)';
      chat_msg(m);
    });
  });

  // ============================================
  // ================ LEAVE The Chat Room........
  // ============================================
  on_click("#Leave_Chat_Room a", function (e) {
    swap_display('#Home_Page', '#Chat_Room');
    official_chat_msg({
      body: "Sending message that you are leaving..."
    });

    // Enter the Chat Room...
    post("/chat_room/leave", {}, function (err, raw) {
      if (err) {
        log(err);
        return false;
      }

      official_chat_msg({body: "You are now OUT of the chat room."});
    });
    return false;
  });

});










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






