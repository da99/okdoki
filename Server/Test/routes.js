
var _         = require('underscore')
, OK          = require('okdoki/lib/routes/router').OK
, Views       = require('okdoki/lib/helpers/Views').Views
;


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
    resp.cookie('rem', 'yes', { maxAge: 9, httpOnly: false});
    req.session.something = "trye";
    t = "SET";
  }

  resp.writeHead(200, { "Content-Type": "text/plain" });
  resp.end(t);
});

OK.get('/now', function (req, resp) {

  var query = new db.query("SELECT NOW() as when", [], function(result) {
    resp.writeHead(200, { "Content-Type": "text/plain" });
    resp.end("" + result.rows[0].when);
  });

});





