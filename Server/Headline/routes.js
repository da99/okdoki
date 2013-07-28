
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
    .read_one('screen_name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, req.user, j);
    })
    .create_one(function (j, sn) {
      Headline.create_by_screen_name(sn, data, j);
    })
    .job(function (j, model) {
      resp.json({
        success : true,
        msg     : 'Created: ',
        model   : model.public_data()
      });
    })
    .run();
  });

  // ============ READ =================================================
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





