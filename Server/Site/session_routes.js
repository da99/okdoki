var _ = require("underscore"),
Customer = require("../Customer/model").Customer
;

module.exports.route = function (mod) {

  var app = mod.app;
  var sign_in = mod.sign_in;

  app.get('/log-out', function (req, resp, next) {
    req.logout();
    resp.redirect('/');
  });

  app.post('/account', function (req, resp, next) {
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
      sign_in(req, resp, next);
    });
  });

  app.post('/sign-in', function (req, resp, next) {

    if (!req.body.screen_name || req.body.screen_name.trim().length == 0 )
      return resp.json( { msg: "Screen name is required.", success: false } );

    if (!req.body.pass_phrase || req.body.pass_phrase.trim().length == 0 )
      return resp.json( { msg: "Password is required.", success: false } );

    sign_in(req, resp, next);

    return false;
  });

};
