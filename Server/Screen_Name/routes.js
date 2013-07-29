
var _         = require('underscore')
, Screen_Name = require('../Screen_Name/model').Screen_Name
, Bot         = require('../Screen_Name/Bot').Bot
, Website     = require('../Website/model').Website
, Folder      = require('../Folder/model').Folder
, Follow      = require('../Follow/model').Follow
, log         = require("../App/base").log
, Canon_SN    = require("../../Client/js/Screen_Name").canonize_screen_name
;

exports.route = function (mod) {

  var OK = mod.app;
  var app = mod.app;


  // =============== CREATE =========================================

  OK.post('/me', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    var r  = mod.New_River(req, resp, next);
    var c  = req.user;

    c.new_data = req.body;
    r.job(function (j) {
      Screen_Name.create(c, j);
    })
    .job(function (j, sn) {
      OK.json_success("Your new life has been created: " + sn.data.screen_name, {screen_name: sn.data.screen_name});
    })
    .run();
  });

  app.post('/Bot', function (req, resp, next) {
    mod.New_River(req, resp, next)
    .job('create', function (j) {
      Bot.create({prefix: req.body.prefix, owner: req.body.as_this_life}, j);
    })
    .run(function (fin, o) {
      var bot = o.public_data();
      return resp.json({success: true, msg: "Bot created: " + bot.screen_name, bot: bot});
    });
  });

  // =============== READ ===========================================

  app.get('/me/:screen_name', function (req, resp, next) {
    if (req.params.screen_name.toUpperCase() !== req.params.screen_name)
      return resp.redirect(301, "/me/" + req.params.screen_name.toUpperCase())
    var OK     = mod.New_Request(req, resp, next);
    var data   = null;

    mod.New_River(req, resp, next)
    .read_one('screen_name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, req.user, j);
    })
    .job(function (j, list) {
      if (!list)
        return req.next();
      var uni = list.website;
      data               = OK.template_data('Screen_Name/me');
      data['title']      = "The life of " + req.params.screen_name;
      OK.render_template();
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

     .on_next('invalid', function (j) {
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


  // =============== DELETE/TRASH ===================================

  OK.post('/undo/trash/:screen_name/:name', function (req, resp, next) {
    var n = req.params.name;
    var r = New_River(next);
    r
    .job('undo trash screen name', n, [Screen_Name, 'undo_trash', req.user, n])
    .run(function () {
      write.json_success(resp, "Screen name, " + n + ", has been taken out of the trash.");
    });
  });

  OK.post('/trash/:screen_name/:name', function (req, resp, next) {
    var name = req.params.name;
    var r = New_River(next);
    r
    .job('trash screen name', n, [Screen_Name, 'trash', req.user, n])
    .run(function () {
      write.json_success(resp, c.screen_name_row(name).trash_msg);
    });
  });



}; // ==== end exports.route






