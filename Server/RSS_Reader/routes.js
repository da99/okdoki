
var _         = require("underscore")._
, RSS_Feed    = require("./Feed").Feed
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Website     = require("../Website/model").Website
, log         = require("../App/base").log
;

exports.route = function (mod) {
  var app = mod.app;

  // ============ READ =================================================

  // ============ CREATE ===============================================
  app.post("/rss/sub", function (req, resp, next) {
    var data = {
      link:  req.body.link,
      owner: req.body.as_this_life
    };

    mod.New_River(req, resp, next)
    .create_one(function (j, sn) {
      RSS_Sub.create(data, j);
    })
    .job(function (j, sub) {
      resp.json({
        success : true,
        msg     : 'You are now subscribed to: ' + sub.nick_name
      });
    })
    .run();
  });

}; // ==== exports.routes





