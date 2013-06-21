
var _         = require('underscore')
, Faker       = require('Faker')
, Screen_Name = require('../Screen_Name/model').Screen_Name
, Website     = require('../Website/model').Website
, Folder      = require('../Folder/model').Folder
;

exports.route = function (mod) {

  var OK = mod.app;
  var app = mod.app;

  // =============== READ ===========================================

  app.get('/me/:screen_name', function (req, resp, next) {
    if (req.params.screen_name.toUpperCase() !== req.params.screen_name)
      return resp.redirect(301, "/me/" + req.params.screen_name.toUpperCase())
    var OK     = mod.New_Request(req, resp, next);
    var data   = null;

    mod.New_River(req, resp, next)
    .read_one('screen name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, req.user, j);
    })
    .read_one('website', function (j, sn) {
      Website.read_by_screen_name(sn, j);
    })
    .read_one('folders', function (j, website) {
      Folder.read_list_by_website(website, j)
    })
    .job(function (j, folder_arr) {
      if (!folder_arr)
        return req.next();
      var uni = j.river.ans.website;
      data               = OK.template_data('Screen_Name/me')
      data['title']      = uni.data.title || req.params.screen_name;
      data['website']    = uni;
      data['website_id'] = uni.data.id;
      data['folders']    = folder_arr;
      OK.render_template();
    })
    .run();
  });


  // =============== CREATE =========================================

  OK.post('/me', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    var r = mod.New_River(req, resp, next);
    var c = req.user;
    c.new_data = {screen_name: req.body.screen_name};
    r.job(function (j) {
      Screen_Name.create(c, j);
    })
    .job(function (j, last) {
      OK.json_success("Created.", {screen_name: req.body.screen_name});
    })
    .run();
  });

  // =============== UPDATE =========================================

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

  OK.post('/chat_room/msgs', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    var list = [];
    if (parseInt(Math.random() * 10) % 2) {
      list = [
        {author_screen_name: Faker.Name.firstName(), body: Faker.Lorem.paragraph()},
        {author_screen_name: Faker.Name.firstName(), body: Faker.Lorem.paragraph()}
      ];
    }
    OK.json({success: true, msg: "Chat msgs for: " + req.body.after, list: list});
  });

  OK.post('/chat_room/enter', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    OK.json({success: true, msg: "HELLO: You're in the room."});
  });

  OK.post('/chat_room/leave', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    OK.json({success: true, msg: "BYE BYE: You're officially out of the room."});
  });


}; // ==== end exports.route






