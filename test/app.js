var _     = require("underscore")
, assert  = require("assert")
, request = require("request")
, exec    = require("child_process").exec
, spawn   = require("child_process").spawn
, cheerio = require("cheerio")
, expect  = require("expect.js")
;

function get(uri, func) {
  uri = 'http://localhost:5009' + uri;
  request(uri, function (err, resp, body) {
    if (func.length === 3)
      func(err, resp, body);
    else
      func(err, resp, body, {
        _csrf: cheerio.load(body)('#_csrf').text()
      });
  });
}

describe( 'Express App', function () {

  before(function (done) {
    var server = spawn("bin/restart", ['5009']);
    var is_done = false;
    var fin = function () {
      if (!is_done) {
        is_done = true;
        done();
      }
    }
    server.stdout.on('data', function (data) {
      // process.stdout.write("" + data);
      if (data.toString().indexOf('isten') > 0)
        fin();
    });

    server.stderr.on('data', function (data) {
      fin();
      process.stdout.write("" + data);
    });

    server.on('close', function (code) {
      console.log('server closed: ' + code, "\n");
    });
  });

  after(function (done) {
    exec('bin/stop 5009', function (err, so, se) {
      if (so) console.log(so);
      if (se) console.log(se);
      if (err) {
        console.log('Error: ', err);
      }
      done();
    });
  });

  it( 'runs', function (done) {
    get('/', function (err, resp, body) {
      assert.equal(null, err);
      assert.equal(true, body.indexOf('/customer') > 0);
      done();
    });
  });

  it( 'includes a _csrf token', function (done) {
    get('/', function (err, resp, body, extra) {
      expect(extra._csrf).match(/[a-z0-9\_\-]{24}/i);
      done();
    });
  });


}); // === end desc
