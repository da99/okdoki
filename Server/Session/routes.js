var _ = require("underscore"),
Customer = require("../Customer/model").Customer
;

module.exports.route = function (mod) {

  var app = mod.app;
  var sign_in = mod.sign_in;

  app.get('/log-out', function (req, resp, next) {

    req.logout();

    req.session = null;
    for (var i in req.cookies) {
      resp.clearCookie(i, { path: '/' });
    }

    resp.redirect('/');
  });

  app.post('/sign-in', function (req, resp, next) {

    if (!req.body.screen_name || req.body.screen_name.trim().length == 0 )
      return resp.json( { msg: "Screen name is required.", success: false } );

    if (!req.body.pass_phrase || req.body.pass_phrase.trim().length == 0 )
      return resp.json( { msg: "Password is required.", success: false } );

    sign_in(req, resp, next);

    return false;
  });

}; // === exports.route



