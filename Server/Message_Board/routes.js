var _           = require('underscore')
, Faker         = require('Faker')
, Message_Board = require('../Message_Board/model').Message_Board
, Screen_Name   = require('../Screen_Name/model').Screen_Name
, Website       = require('../Website/model').Website
, log           = require("../App/base").log
;

// ================================================================
// =============== Message Board ==================================
// ================================================================

exports.route = function (mod) {

  var app = mod.app;

  // =============== CREATE ======================
  app.post('/message_board/msg', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    var data = req.body;
    data.author_id = req.user.screen_name_id(data.as_this_life);

    mod.New_River(req, resp, next)
    .job(function (j) {
      Message_Board.create(data, j);
    })
    .job(function (j, msg) {
      msg.data.author_screen_name = req.body.as_this_life;
      OK.json({
        success: true,
        msg: "Message has been saved.",
        mb_msg: msg.data
      });
    })
    .run();
  });


  // ================= READ ======================
  app.get('/me/:screen_name/message_board/msgs', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    mod
    .New_River(req, resp, next)
    .read_one('screen name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, j);
    })
    .read_one('website', function (j, sn) {
    log(sn)
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



}; // === route
