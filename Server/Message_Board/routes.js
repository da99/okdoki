var _           = require('underscore')
, Faker         = require('Faker')
, Message_Board = require('../Message_Board/model').Message_Board
;

// ================================================================
// =============== Message Board ==================================
// ================================================================

exports.route = function (mod) {

  var app = mod.app;

  app.post('/message_board/msg', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    OK.json({success: true, msg: "Message has been saved.", mb_msg: {author_screen_name: "GO99", body: req.body.body}});
  });

  app.get('/message_board/msgs/:website_id', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    mod.New_River(req, resp, next)
    .job(function (j) {
      Message_Board.read_by_website_id(req.params.website_id, j);
    })
    .job(function (j, list) {
      OK.json({success: true, msg: "Message Board msgs for: " + req.params.website_id, list: list});
    })
    .run();
  });

}; // === route
