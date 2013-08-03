
var _         = require("underscore")._
, Bot       = require("./model").Bot
, Bot_Use     = require('../Bot/Use').Use
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Website     = require("../Website/model").Website
, log         = require("../App/base").log
;

exports.route = function (mod) {
  var app = mod.app;

  // ============ CREATE ===============================================

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

  app.post('/Bot/use', function (req, resp, next) {
    mod.New_River(req, resp, next)
    .job('create', function (j) {
      Bot_Use.create({
        bot   : req.body.bot,
        owner : req.body.as_this_life
      }, j);
    })
    .run(function (fin, o) {
      var use = o.public_data();
      return resp.json({
        success: true,
        msg: 'You are now using, ' + use.screen_name + ', with ' + use.owner + '.'
      });
    });
  });


  // ============ READ =================================================

  app.get("/Bot/:id", function (req, resp, next) {
    var OK            = mod.New_Request(arguments);
    var opts          = OK.template_data('Bot/show_one');
    opts['title']     = "Bot #" + req.params.id;
    return OK.render_template();
  });

  // ============ UPDATE ===============================================

  app.put('/Bot', function (req, resp, next) {
    mod.New_River(req, resp, next)
    .job('update', function (j) {
      Bot.update({
        prefix : req.body.prefix,
        owner  : req.body.as_this_life,
        code   : req.body.code
      }, j);
    })
    .run(function (j, last) {
      var bot = last.public_data();
      resp.json({success: true, msg: "Update successful.", bot: bot});
    });
  });

}; // ==== exports.routes





