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

var _csrf = null;

function post(data, func) {
  data.url = "http://localhost:5009" + (data.url);
  return request.post(data, func);
}

function get(uri, func) {
  uri = 'http://localhost:5009' + uri;
  return request(uri, function (err, resp, body) {
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
    var server = spawn("bin/restart", ['5009']);
    var is_done = false;
    var fin = function () {
      if (!is_done) {
        is_done = true;
        done();
      }
    }
    server.stdout.on('data', function (raw_data) {
      var data = raw_data + "";
      if (!data.match(/(GET|POST) \//))
          process.stdout.write(data);
      if (data.indexOf('isten') > 0)
        fin();
    });

    server.stderr.on('data', function (data) {
      process.stdout.write("" + data);
      fin();
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

  describe( 'the basics', function () {

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

  }); // === end desc: the basices

  describe( 'Customer', function () {
    it( 'allows customer to be created', function (done) {
      var body = {
        _csrf: _csrf,
        screen_name: "ted_nelson",
        pass_phrase: "i h8 u",
        confirm_pass_phrase: "i h8 u"
      };
      post({url: '/customer', form: body}, function (err, resp, body) {
        assert.equal(null, err && err.message);
        console.log(body)
        expect(JSON.parse(body).msg).match(/Account created./i);
        done();
      });
    });

    it( 'allows customer to be sign-ed in', function (done) {
      var body = {
        _csrf: _csrf,
        screen_name: "ted_nelson",
        pass_phrase: "i h8 u",
      };
      post({url: '/sign-in', form: body}, function (err, resp, body) {
        assert.equal(null, err && err.message);
        expect(JSON.parse(body).msg).match(/Success: Please wait as page reload/i);
        done();
      });
    });
  }); // === end desc: Customer

  describe( 'Screen Name', function () {
    it( 'loads home page', function (done) {
      get('/me/TeD_NelsOn', function (err, resp, body) {
        expect(body).match(/the life of/i);
        done();
      });
    });
  }); // === end desc
}); // === end desc



