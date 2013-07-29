
var _         = require("underscore")._
, Faker         = require('Faker')
, Headline       = require("./model").Headline
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Website     = require("../Website/model").Website
, log         = require("../App/base").log
;

exports.route = function (mod) {
  var app = mod.app;

  // ============ CREATE ===============================================
  app.post("/Headline", function (req, resp, next) {
    var data = _.clone(req.body);
    mod.New_River(req, resp, next)
    .create_one(function (j, sn) {
      Headline.create({author: req.body.as_this_life, body: req.body.body}, j);
    })
    .job(function (j, model) {
      var o = model.public_data();
      o.is_me = true;
      resp.json({
        success : true,
        msg     : 'Created: ' + o.preview,
        headline: o
      });
    })
    .run();
  });

  // ============ READ =================================================

  app.post('/heart_beep', function (req, resp, next) {
    mod.New_River(req, resp, next)

    .job('read list', function (j) {
      if (req.body.get_old)
        Headline.read_old_list(req.user, j);
      else
        Headline.read_new_list(req.user, req.body.start_at, j);
    })

    .run(function (fin, list) {
      resp.json({
        success : true,
        msg     : "Done.",
        list    : _.map(list, function (o) {
          return o.public_data();
        })
      });
    });
  });

  app.get("/Headline/:id", function (req, resp, next) {
    var OK            = mod.New_Request(arguments);
    var opts          = OK.template_data('Headline/show_one');
    opts['title']     = "Headline #" + req.params.id;
    return OK.render_template();
  });

  app.get('/me/:screen_name/message_board/msgs', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    mod
    .New_River(req, resp, next)
    .read_one('screen name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, j);
    })
    .read_one('website', function (j, sn) {
      Website.read_by_screen_name(sn, j);
    })
    .read_list(function (j, website) {
      Message_Board.read_by_website(website, j);
    })
    .job(function (j, list) {
      OK.json({
        success: true,
        msg: "Done.",
        list: list || []
      });
    })
    .run();
  });


}; // ==== exports.routes





