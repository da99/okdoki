var _   = require('underscore')
, Faker = require('Faker')
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

  app.get('/message_board/msgs', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    var list = [];
      list = [
        {author_screen_name: Faker.Name.firstName(), body: Faker.Lorem.paragraph()},
        {author_screen_name: Faker.Name.firstName(), body: Faker.Lorem.paragraph()}
      ];
    OK.json({success: true, msg: "Message Board msgs for: " + req.body.after, list: list});
  });

}; // === route
