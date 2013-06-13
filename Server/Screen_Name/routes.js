
var _         = require('underscore')
;

exports.route = function (mod) {

  var OK = mod.app;
  var app = mod.app;

  app.get('/me/:name', function (req, resp, next) {
    var OK        = mod.New_Request(arguments);
    var data      = OK.template_data('Screen_Name/me')
    data['title'] = req.params.name;
    data['name']  = req.params.name;
    data['screen_names'] = ['GO99', 'disco_jonny'];
    return OK.render_template();
  });


  // ================================================================
  // =============== UPDATE =========================================
  // ================================================================

  OK.put('/screen_names/:name', function (req, resp, next) {
    var n = req.params.name;
    var new_vals = _.pick(req.body,
                          'read_able',
                          'read_able_list',
                          'about',
                          'at_url',
                          'at_pass_phrase',
                          'bot_url',
                          'bot_pass_phrase'
                         );

     var r = New_River(next);

     r

     .next('invalid', function (j) {
       write.json_fail(resp, j.invalid_msg);
     })

     .job('update screen name:', n, [Screen_Name, 'update', req.user, n, new_vals])

     .run(function (r) {

       var c   = req.user;
       var msg = null;

       switch (c.sanitized_data.read_able) {
         case 'W':
           msg = "Updated settings: Anyone online may see this homepage.";
         break;
         case 'N':
           msg = "Updated settings: no one but you can see this homepage.";
         break;
         case 'S':
           msg = "Updated settings: The following may see your homepage: " + c.sanitized_data.read_able_list.join(', ');
         break;
         default:
           if (c.sanitized_data.about) {
           msg = 'Your "About Me" section has been updated.';
         } else if (c.sanitized_data.new_screen_name) {
           msg = 'Your screen name has been updated.';
         } else {
           msg = 'Your web app info has been updated.';
         };

       };

       var public = {};
       _.each(new_vals, function (v, k) {
         if (c.sanitized_data.hasOwnProperty(k))
           public[k] = c.sanitized_data[k];
         if (k.indexOf('pass_phrase') > -1 && (public[k] || '').trim().length > 0)
           public[k] = '[hidden]';
       });

       write.json_success(resp, msg, {updated: public});
     });

  });


  // ================================================================
  // =============== DELETE/TRASH ===================================
  // ================================================================

  OK.post('/undo/trash/screen_name/:name', function (req, resp, next) {
    var n = req.params.name;
    var r = New_River(next);
    r
    .job('undo trash screen name', n, [Screen_Name, 'undo_trash', req.user, n])
    .run(function () {
      write.json_success(resp, "Screen name, " + n + ", has been taken out of the trash.");
    });
  });

  OK.post('/trash/screen_name/:name', function (req, resp, next) {
    var name = req.params.name;
    var r = New_River(next);
    r
    .job('trash screen name', n, [Screen_Name, 'trash', req.user, n])
    .run(function () {
      write.json_success(resp, c.screen_name_row(name).trash_msg);
    });
  });


  // ================================================================
  // =============== Chat Room ======================================
  // ================================================================

  OK.post('/chat_room/msg', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    OK.json({success: true, msg: req.body.body, chat_msg: {author_screen_name: "GO99", body: req.body.body}});
  });

  OK.post('/chat_room/enter', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    OK.json({success: true, msg: "You are now in the chat room."});
  });


}; // end route






