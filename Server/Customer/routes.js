var _      = require("underscore")
, Customer = require("../Customer/model").Customer
, log      = require('../App/base').log
;

module.exports.route = function (mod) {

  var app = mod.app;

  mod.allow_unauth_path('POST', '/customer')
  app.post('/customer', function (req, resp, next) {
    var r = mod.New_River(arguments);
    r.job(function (j) {
      Customer.create({
        screen_name         : req.body.screen_name,
        display_name        : req.body.screen_name,
        ip                  : req.ip,
        pass_phrase         : req.body.pass_phrase,
        confirm_pass_phrase : req.body.confirm_pass_phrase
      }, j);
    })
    .run(function (r, last) {
      var sn = last.screen_names()[0];
      mod.sign_in(req, resp, next, "Account created. Please wait as your profile page is loaded...");
    });
  });

  app.post('/settings/list', function (req, resp, next) {
    resp.json([
      'draw settings box', ["rss_news_wire", "RSS News Wire"],
      'is on', [],
      'is genius', []
    ]);
  });

}; // === exports.route




