
var _         = require("underscore")
, Follow      = require("./model").Follow
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Website     = require("../Website/model").Website
, log         = require("../App/base").log
;

exports.route = function (mod) {
  var app = mod.app;

  // ============ READ =================================================
  // app.get("/Follow/:id", function (req, resp, next) {
    // var OK            = mod.New_Request(arguments);
    // var opts          = OK.template_data('Follow/show_one');
    // opts['title']     = "Follow #" + req.params.id;
    // return OK.render_template();
  // });

  // ============ CREATE ===============================================
  app.post("/me/:screen_name/follow", function (req, resp, next) {
    var data = _.clone(req.body);
    data.follower_id = req.body.life_id;

    mod.New_River(req, resp, next)
    .read_one('screen_name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, req.user, j);
    })
    .read_one('website', function (j, sn) {
      Website.read_by_screen_name(sn, j);
    })
    .create_one(function (j, website) {
      Follow.create_by_website(website, data, j);
    })
    .job(function (j, follow) {
      resp.json({
        success : true,
        msg     : 'You\'re subscribed...'
      });
    })
    .run();
  });

  // ============ TRASH ================================================
  app.delete('/me/:screen_name/follow', function (req, resp, next) {
    var Request = mod.New_Request(req, resp, next);

    mod
    .New_River(req, resp, next)
    .read_one('screen_name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, req.user, j);
    })
    .read_one('website', function (j, sn) {
      Website.read_by_screen_name(sn, j);
    })
    .trash('follow', function (j, website) {
      Follow.trash_by_website_and_customer(website, req.user, j);
    })
    .job(function (j, arr) {
      log(arr)
      Request.json({
        success: true,
        msg: "Unsubscribed."
      });
    })
    .run();
  });

}; // ==== exports.routes





