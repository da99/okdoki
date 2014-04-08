
var _         = require('underscore')
, OK          = require('../App/router').OK
, Views       = require('../App/helpers/Views').Views
, Akui        = require('akui')
;


if (process.env.IS_TESTING) {
  OK.engine.use(Akui("test/ui"));

OK.get('/disconnect', function (req, resp) {
  setTimeout(function () {
    log('Exiting server process to test disconnection errors.');
    process.exit(0);
  }, 2000);
  write_json_success(resp, "Disconnecting in 2 seconds.");
});


OK.get( '/cookie', function (req, resp) {
  var t = "NOT SET";
  if (req.cookies.rem) {
    var do_n = null;
  } else {
    resp.cookie('rem', 'yes', { maxAge: 9, httpOnly: true, secure: true});
    t = "SET";
  }

  resp.send(t);
});

OK.get('/now', function (req, resp) {

  var query = new db.query("SELECT NOW() as when", [], function(result) {
    resp.send("" + result.rows[0].when);
  });

});

} // ======================================= if




