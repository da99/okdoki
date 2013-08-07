var _     = require("underscore")
, Customer= require("../Server/Customer/model").Customer
, River   = require("da_river").River
, h       = require("./helpers")
, assert  = require("assert")
, request = require("request")
, exec    = require("child_process").exec
, spawn   = require("child_process").spawn
, cheerio = require("cheerio")
, expect  = require("expect.js")
;

process.env.PORT = '1111';

var use_log = false;
var _csrf = null;
var j = request.jar();

function post(data, func) {
  data.url = "https://localhost" + (data.url);
  data.jar = j;
  data.headers || (data.headers = {});
  data.headers['Accept'] = "application/json";
  data.headers['Content-Type'] = "application/json";
  data.rejectUnauthorized = false;
  return request.post(data, func);
}

function get(uri, func) {
  uri = 'https://localhost' + uri;
  return request({uri: uri, method: 'GET', jar: j, rejectUnauthorized: false}, function (err, resp, body) {
    expect(body).not.match(/go99/i);
    var $ = cheerio.load(body);
    _csrf = $('#_csrf').text();
    if (func.length === 3)
      func(err, resp, body);
    else
      func(err, resp, body, {
        _csrf: _csrf,
        $    : $,
        form : function (id, data) {
          data._csrf = _csrf;
          var form = $(id);
          return _.extend(data, { form: form, action: form.attr('action') });
        }
      });
  });
}

// ==================================================
// ==================================================

describe( 'app', function () {

  it('escapes url params');
  it('escapes post data');
  it('escapes query string');

  it('escapes screen names, not just canon-ize them')

  it('exits gracefully for SIGTERM')
  it('exits gracefully for SIGINT')

  it( 'renders an error page just with {msg: ""}' )

}); // === end desc

describe( 'Unauthenticated users:', function () {
  it('sends a secure/HTTP only cookie')

  it('does not store any data in session')

  it('sends a JSON response if unauthenticated for POST requests, JSON-accept')
  it('sends a JSON response if 403/forbidden   for POST requests, JSON-accept')

  it('sends a HTTP response if unauthenticated for POST requests, HTTP-accept')

}); // === end desc

describe( 'Auth users (aka Customers)', function () {
  it('checks as_this_life belongs to customer');
}); // === end desc

// ==================================================
// ==================================================
describe( 'Express App', function () {

  before(function (done) {
    River.new(null)
    .job(function (j) {
      Customer.delete_all(j);
    })
    .run(function () {
      done();
    });
  });

  before(function (done) {
    var server = spawn("bin/restart");
    var is_done = false;
    var fin = function () {
      if (!is_done) {
        is_done = true;
        done();
      }
    }
    server.stdout.on('data', function (raw_data) {
      var data = raw_data + "";

      if (!data.match(/(GET|POST) \//) && use_log)
          process.stdout.write(data);
      if (data.indexOf('isten') > 0)
        fin();
    });

    server.stderr.on('data', function (data) {
      use_log && process.stdout.write("" + data);
      fin();
    });

    server.on('close', function (code) {
      use_log && console.log('server closed: ' + code, "\n");
    });
  });

  after(function (done) {
    exec('bin/stop', function (err, so, se) {
      if (so) console.log(so);
      if (se) console.log(se);
      if (err) {
        console.log('Error: ', err);
      }
      done();
    });
  });

  describe( 'the basics', function () {

    it( 'runs', function (done) {
      get('/', function (err, resp, body) {
        assert.equal(null, err);
        assert.equal(true, !!(body.match(/create a new account/ig)))
        done();
      });
    });

    it( 'includes a _csrf token', function (done) {

      get('/', function (err, resp, body, extra) {
        expect(extra._csrf).match(/[a-z0-9\_\-]{24}/i);
        done();
      });
    });

    it( 'escapes .body (form) data' );
    it( 'escapes .params data' );
    it( 'escapes .query data' );
    it( 'escapes .cookie data' );

  }); // === end desc: the basices

  describe( 'Customer', function () {
    it( 'allows customer to be created', function (done) {
      var body = {
        _csrf               : _csrf,
        screen_name         : "t_nelson",
        pass_phrase         : "i h8 this",
        confirm_pass_phrase : "i h8 this"
      };

      post({url: '/customer', form: body}, function (err, resp, body) {
        assert.equal(null, err && err.message);
        expect(JSON.parse(body).msg).match(/Account created./i);
        done();
      });
    });

    it( 'allows customer to be sign-ed in', function (done) {
      var body = {
        _csrf: _csrf,
        screen_name: "t_nelson",
        pass_phrase: "i h8 this",
      };
      post({url: '/sign-in', form: body}, function (err, resp, body) {
        assert.equal(null, err && err.message);
        expect(JSON.parse(body).msg).match(/Success: Please wait as page reload/i);
        done();
      });
    });

    it( 'loads customized / for logged-in customer', function () {
      get('/', function (err, resp, body) {
        assert.equal(body, "My Okdoki");
        done();
      });
    });
  }); // === end desc: Customer

  describe.skip( 'Screen Name', function () {
    it( 'loads home page', function (done) {
      get('/me/T_NelsOn', function (err, resp, body) {
        expect(body).match(/the life of/i);
        done();
      });
    });
  }); // === end desc
}); // === end desc



