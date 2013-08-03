
var _ = require("underscore")._
, Ok  = require("../Ok/model").Model
, log = require("../App/base").log
, F   = require("tally_ho").Tally_Ho
;

var Bot       = Ok.Bot
, Bot_Use     = Ok.Bot_Use
, Bot_Code    = Ok.Bot_Code
, Screen_Name = Ok.Screen_Name
;

exports.route = function (mod) {
  var app = mod.app;

  // ============ CREATE ===============================================

  app.post('/Bot', function (req, resp, next) {
    mod.New_River(req, resp, next)
    .job('create', function (j) {
      Bot.create({sub_sn: req.body.sub_sn, owner: req.body.as_this_life}, j);
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

  app.get('/bot/:screen_name', function (req, resp, next) {

    F.run('read Bot by screen name', {screen_name: req.params.screen_name}, function (o) {
      var bot = o.val;

      if (!bot)
        return req.next();

      var data         = req.OK.template_data('Bot/bot');
      data['bot']      = bot.public_data();
      data['title']    = data['bot'].screen_name;
      data['Bot_Code'] = Bot_Code;

      req.OK.render_template();
    });

  });

  app.get('/bots/for/:screen_name', function (req, resp, next) {
    mod.New_River(req, resp, next)
    .job('read', function (j) {
      Bot.read_list_to_run(req.params.screen_name, j);
    })
    .run(function (fin, list) {
      return resp.json({
        success: true,
        msg: "List read.",
        bots: list
      });
    });
  });

  // ============ UPDATE ===============================================

  app.put('/Bot', function (req, resp, next) {
    mod.New_River(req, resp, next)
    .job('update', function (j) {
      Bot.update({
        sub_sn : req.body.sub_sn,
        owner  : req.body.as_this_life,
        code   : req.body.code
      }, j);
    })
    .run(function (j, last) {
      var bot = last.public_data();
      resp.json({success: true, msg: "Update successful.", bot: bot});
    });
  });

  app.put('/Bot/Code', function (req, resp, next) {
    F.run("update Bot Code", {aud: req.user, data: req.body}, function () {
      resp.json({success: false, msg: req.body.type});
    });
  });

}; // ==== exports.routes





