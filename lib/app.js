
function log() {
  console['log'].apply(console, arguments);
}

var shutting_down = false;
var tell = function () { log(' ---- '); };

var password_hash = require('password-hash');

var shortid = require('shortid');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (screen_name, password, done) {
    log("Not ready: " + screen_name);
    done(null, false, {message: "Not ready."});
  }
));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  done(null, {screen_name: "bob", id: "1"});
});


var express = require('express');
var app     = express();
var port    = process.env.PORT || 5555;
var secret  = process.env.SESSION_SECRET;
var db_conn = process.env.HEROKU_POSTGRESQL_BLACK_URL;
var ip_addr = process.env.NODE_IP_FOR_AUTH;
var pg_client = null;

var app_dir = __dirname.split('/');
app_dir.pop();
app_dir = app_dir.join('/');

if (!secret) {
  throw new Error('No session secret set.');
}

if (!db_conn) {
  throw new Error('No db conn string set.');
}

if (!ip_addr) {
  throw new Error('No ip auth set.');
}

var pg = require('pg');
pg_client = new pg.Client(db_conn);
pg_client.connect();

// app.use(express.errorHandler());
if (process.env.USE_LOGGER) {
  app.use(express.logger('dev'));
}

app.use(express.static(app_dir + '/public' ));
app.use(express.bodyParser());
app.locals.pretty = true;
app.use(express.cookieParser());
app.use(express.cookieSession({secret: secret + secret}));
app.use(express.csrf());

app.use(passport.initialize());
// Must go after session middleware.
app.use(passport.session());


app.configure( function () {
  app.set('view engine', 'jade');
  app.set('views', app_dir + '/views');
});

app.use( function (req, resp, next) {
  if (shutting_down) {
    resp.setHeader('Connection', 'close');
  }
  next();
});

function write_plain(r, txt) {
  resp.writeHead(200, { "Content-Type": "text/plain" });
  resp.end(txt);
}

function write_json(resp, o) {
  resp.writeHead(200, { "Content-Type": "application/json" });
  resp.end(JSON.stringify(o));
}

function get_latest_msg(req, resp) {
  pg_client.query("SELECT * FROM bot_chat WHERE date > $1", [req.body.date], function (err, meta) {
    var result = meta.rows;
    if (meta.rowCount > 0)
      resp.end(JSON.stringify({ msg: result, success: true, refresh: 10 }));
    else
      resp.end(JSON.stringify({ msg: [], success: true, refresh: 10 }));
  });
}

app.use(app.router)
app.post('/ask', function(req, resp) {
  var data = req.body;
  var is_dev = data.is_dev === true;
  if(!req.session.name)
    req.session.name = "Stranger #" + (new Date()).getSeconds();

  resp.writeHead(200, { "Content-Type": "application/json" });
  var req_type = data.request_type;
  var msg = null;
  var refresh = 1.5;
  var is_notify = false;

  switch (req_type) {
    case 'latest msgs':
      get_latest_msg(req, resp);
      break;

    case 'save msg':
      if (req.ip === ip_addr || (is_dev && req.ip === '127.0.0.1')) {
        var text = 'INSERT INTO bot_chat(date, msg, author) VALUES($1, $2, $3) RETURNING id';
        var vals = [ (new Date).getTime(), data.msg, data.author ];
        pg_client.query( text, vals, function (err, meta) {

          if (meta.rowCount) {
            get_latest_msg(req, resp)
            // resp.end(JSON.stringify({ msg: { msg: req.param('msg'), id: meta.rows[0].id, author: req.param('author') }, success: true, refresh: 6 }));
          } else {
            resp.end(JSON.stringify({ msg: "Failed.", success: false, refresh: 6 }));
          }
        });
      } else  {
        resp.end(JSON.stringify({ msg: "inserted", success: true, refresh: 600000 }));
      }

      break;
    case 'bots list':
      var bots_list = {
        'okdoki'              : {subscribed: true, url: 'http://www.okdoki.com/ask' },
        'Clock.Bot'           : {subscribed: true, url: 'http://okdoki-clock-bot.heroku.com/ask' },
        'Obama.Miracles'      : {subscribed: true, url: 'http://okdoki-obama-miracles.heroku.com/ask'},
        'Mr.Liberty'          : {subscribed: true, url: 'http://okdoki-mr-liberty.heroku.com/ask'},
        'Tech.Toys'           : {subscribed: true, url: 'http://okdoki-tech-toys.heroku.com/ask'},
        'Hearts.Club'         : {subscribed: true, url: 'http://okdoki-hearts-club.heroku.com/ask'},
        'Gossip.News.Network' : {subscribed: true, url: 'http://okdoki-gossip-news-network.heroku.com/ask'},
        'My.Astro.Future'     : {subscribed: true, url: 'http://okdoki-my-astro-future.heroku.com/ask'},
        'Good.News'           : {subscribed: true, url: 'http://okdoki-good-news.heroku.com/ask'},
        'Bad.News'            : {subscribed: true, url: 'http://okdoki-bad-news.heroku.com/ask'},
        'American.Sports'     : {subscribed: true, url: 'http://okdoki-american-sports.heroku.com/ask'},
        'Biz.Rumors'          : {subscribed: true, url: 'http://okdoki-biz-rumors.heroku.com/ask'},
        'Global.War'          : {subscribed: true, url: 'http://okdoki-global-war.heroku.com/ask'},
        'Men.Of.Action'       : {subscribed: true, url: 'http://okdoki-men-of-action.heroku.com/ask'},
        'Beauty.Gene'         : {subscribed: true, url: 'http://okdoki-beauty-gene.heroku.com/ask'},

        'Mr.Sci.Tech'         : {subscribed: false, url: 'http://okdoki-mr-sci-tech.heroku.com/ask'},
        'history-bot'         : {subscribed: false, url: 'http://okdoki-history-bot.heroku.com/ask'},
        'Econo.Liberty'       : {subscribed: false, url: 'http://okdoki-econo-liberty.heroku.com/ask'},
        'Kuala.Lumpur'        : {subscribed: false, url: 'http://okdoki-kuala-lumpur.heroku.com/ask'},
        'Tokyo.Mania'         : {subscribed: false, url: 'http://okdoki-tokyo-mania.heroku.com/ask'},
        'Osaka.Jonny'         : {subscribed: false, url: 'http://okdoki-osaka-jonny.heroku.com/ask'}
      };

      break;

    default:
      resp.end(JSON.stringify({ success: false, msg: 'Unknown request type.' }));
  }

});


app.get( '/cookie', function (req, resp) {
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


app.get( '/', function (req, resp) {
  var opts = default_view_opts('index', req, resp)

  if (opts.logged_in) {
    opts['title']     = "Your OKdoki Homepage(s)";
  } else {
    opts['title']     = 'OkDoki.com';
  };

  resp.render( opts['view_name'], opts);
});

app.get( '/info/:name', function (req, resp) {
  var opts = default_view_opts('info', req, resp);
  opts.title = req.params.name;
  opts.life_name = req.params.name;
  resp.render(opts['view_name'], opts  );
});


app.get( '/chat', function (req, resp) {
  resp.header('CSRF-TOKEN', req.session._csrf);
  resp.render('chat', {lifes: ['go99'], screen_name: 'go99', view_name: 'chat', title: "Chat", token: req.session._csrf});
});

// app.get( '/login', function (req, resp) {
  // resp.render('login', {title: 'Login', token: req.session._csrf});
// });


app.get('/now', function (req, resp) {

  var query = pg_client.query("SELECT NOW() as when");
  query.on('row', function(result) {
    resp.writeHead(200, { "Content-Type": "text/plain" });
    resp.end("" + result.when);
  });

});

app.post('/sign-in', function (req, resp) {
  // passport.authenticate('local'),
  write_json(resp, { msg: "Not ready.", success: false });
});

app.post('/create-account', function (req, resp) {

  var mask_id            = shortid.seed((req.ip + (new Date).getTime()).replace( /[^0-9]/g, '')).generate();
  var consumer_id        = shortid.seed((req.ip + (new Date).getTime()).replace( /[^0-9]/g, '')).generate();
  var now                = (new Date).getUTCMilliseconds() ;
  var data               = req.body;
  var passphrase         = data.passphrase.trim();
  var confirm_passphrase = data.confirm_passphrase.trim();


  var text = '\
    BEGIN                                                                      \
     INSERT INTO masks(id, consumer_id, created_at, name) VALUES($1, $2, $3, $4) \
     INSERT INTO consumers(id, created_at, contact_info, passphrase_hash) VALUES( $5, $6, $7, $10)   \
    COMMIT;                                                                    \
  ';

  if (passphrase !== confirm_passphrase) {
    resp.end(JSON.stringify({ msg: "Passwords do not match.", success: false }));
    return false;
  };

  var vals = [
    mask_id, consumer_id, now, data.screen_name,
    consumer_id, now, data.contact_info, password_hash.generate(data.passphrase)
  ];

  pg_client.query( text, vals, function (err, meta) {

    if (err || meta.rowCount === 0) {
      log(err);
      resp.end(JSON.stringify({ msg: "Unknown error. Contact website owner to fix this.", success: false }));
    } else {
      resp.end(JSON.stringify({ msg: "Account created. Login with your screen-name/passphrase.", success: true }));
    }

  });


});

app.use(function (req, resp, next) {
  resp.writeHead(404, { "Content-Type": "text/plain" });
  resp.end("Missing url. Check the address.");
});

app.use(function (err, req, resp, next) {

  log(err);

  if (req.body && req.body.request_type == 'latest msgs') {
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.end(JSON.stringify({ _csrf: req.session._csrf, success: false, msg: err.toString() }));
    return true;
  };

  // next()
  resp.send((err.status || 500), "Something broke. Try later.");
});


// =================================================================================
var server = app.listen(port, function () {
  log('Listening on: ' + port);
});

function cleanup() {
  shutting_down = true;
  log('Closing db connections.');
  pg_client.end();
  process.exit();

  // server.close( function () {
    // log('Closing db connections.');
    // pg_client.end();
    // process.exit()
  // });
}

function screen_names(arr) {
  var names = {first: arr[0], list: arr, multi : (arr.length != 1) };
  return names;
};

function default_view_opts(name, req, resp) {
  var auth = true;
  return { 'view_name': name, logged_in: auth, screen_names: screen_names(['go99', 'Capt-Nando']), token: req.session._csrf};
}

function force_cleanup() {
  cleanup();

  setTimeout( function () {
    console.error("Could not close connections in time, forcing shut down");
    process.exit(1);
  }, 30*1000);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', force_cleanup);

exports.app    = app;
exports.port   = port;
exports.server = server;
exports.pg_client = pg_client;








