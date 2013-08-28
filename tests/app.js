















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

  // #1
  it('escapes url params');

  // #2
  it('escapes post data');

  // #3
  it('escapes query string');

  // #4
  it('escapes screen names, not just canon-ize them')

  // #5
  it('exits gracefully for SIGTERM')

  // #6
  it('exits gracefully for SIGINT')

  // #7
  it( 'renders an error page just with {msg: ""}' )

  // #8
  it( 'uses Content Securoty polciy')

  // #9
  it( 'escapes params for each route' )

  // #10
  it 'prevents session hijacking (rack protection) when useragent changes'

  // #11
  it 'escapes all URL fields in the database (_url) to RFC specs'

  // #12
  it 'sanitizes :return_to url after sign-in & account creation'

  // # 13
  it 'deletes all cookies up log-out'

  // # 14
  it 'escapes HTML'


  // # 15
  it 'escapes json'

  // # 16
  it 'escapes html not starting with a valid html5'

}); // === end desc

describe( 'Unauthenticated users:', function () {
  # 1
  it('sends a secure/HTTP only cookie')

  # 2
  it('does not store any data in session')

  # 3
  it('sends a JSON response if unauthenticated for POST requests, JSON-accept')

  # 4
  it('sends a JSON response if 403/forbidden   for POST requests, JSON-accept')

  # 5
  it('sends a HTTP response if unauthenticated for POST requests, HTTP-accept')

  # 6
  it 'prevents access if CSRF is invalid.'

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



