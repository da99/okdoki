
var _         = require('underscore')
, Redis       = require('redis'),
, OK          = require('okdoki/lib/routes/router').OK
, Views       = require('okdoki/lib/helpers/Views').Views
;

var redis_client = redis.createClient();
client.on('error', function (err) {
  throw new Error("Redis client error: " + err);
});
var id_prefix = 'test_' + (new Date).getTime() + '_';
var test_count = 0;
var LIST_KEY = 'dom_results';

process.on('exit', function () {
  redis_client.quit(function () {
    console['log']('Redis client quit successfully.');
  });
});

function write_result(result, done) {
  var id = id_prefix + (++test_count);
  var vals = [id].concat( _.flatten(_.pairs(result)) );
  redis_client.hset(vals, function (err, replys) {
    if (err) throw err;
    redis_client.rpush( LIST_KEY, id, function (err, replys) {
      if (err) throw err;
      done();
    });
  });
}

function pop(done) {
  redis_client.lpop(LIST_KEY, function (err, reply) {
    if (err) throw err;
    done(reply);
  });
}
function read_results(done) {
  var results = [];
  pop(function (reply) {
    if (reply)
      results.push(reply);
    else
      done(results);
  });
}

OK.get('/report_dom', function (req, resp) {
  write_result(req.data, function () {
    resp.json({success: true});
  });
});

OK.get('/dom_report', function (req, resp) {
  read_results(function (results) {
    resp.json(results)
  });
});

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





