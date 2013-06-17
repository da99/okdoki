var _     = require("underscore")
, assert  = require("assert")
, request = require("request")
, exec    = require("child_process").exec
, spawn   = require("child_process").spawn
;

function get() {
  var args = _.toArray(arguments);
  args[0] = 'http://localhost:5009' + args[0];
  request.apply(null, args);
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

}); // === end desc
