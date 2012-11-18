var tell = function () { console.log(' ---- '); };

var password_hash = require('password-hash');

var shortid = require('shortid');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log("Not ready: " + username);
    done(null, false, {message: "Not ready."});
  }
));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  done(null, {username: "bob", id: "1"});
});


var express = require('express');
var app     = express();
var port    = process.env.PORT || 4567;
var secret  = process.env.SESSION_SECRET;
var db_conn = process.env.HEROKU_POSTGRESQL_BLACK_URL;
var ip_addr = process.env.NODE_IP_FOR_AUTH;

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
var pg_client = new pg.Client(db_conn);
pg_client.connect();

// app.use(express.errorHandler());
if (process.env.DEV) {
  app.use(express.logger('dev'));
}

app.use(express.static(__dirname + '/public'));
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
  app.set('views', __dirname + '/views');
});

function write_plain(r, txt) {
  resp.writeHead(404, { "Content-Type": "text/plain" });
  resp.end(txt);
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


app.get( '/', function (req, resp) {
  // resp.send('Not done. Come back in 15 mins.');
  resp.render('index', {title: 'OkDoki.com', token: req.session._csrf});
});

app.get( '/login', function (req, resp) {
  resp.render('login', {title: 'Login', token: req.session._csrf});
});


app.get('/now', function (req, resp) {

  var query = pg_client.query("SELECT NOW() as when");
  query.on('row', function(result) {
    resp.writeHead(200, { "Content-Type": "text/plain" });
    resp.end("" + result.when);
  });

});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login'}), function (req, resp) {
  write_plain(resp, "authetincaed");
});

app.post('/register', function (req, resp) {

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
    mask_id, consumer_id, now, data.username,
    consumer_id, now, data.contact_info, password_hash.generate(data.passphrase)
  ];

  pg_client.query( text, vals, function (err, meta) {

    if (err || meta.rowCount === 0) {
      console.log(err);
      resp.end(JSON.stringify({ msg: "Unknown error. Contact website owner to fix this.", success: false }));
    } else {
      resp.end(JSON.stringify({ msg: "Account created. Login with your username/passphrase.", success: true }));
    }

  });


});

app.use(function (req, resp, next) {
  resp.writeHead(404, { "Content-Type": "text/plain" });
  resp.end("Missing url. Check the address.");
});

app.use(function (err, req, resp, next) {

  console.log(err);

  if (req.body && req.body.request_type == 'latest msgs') {
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.end(JSON.stringify({ _csrf: req.session._csrf, success: false, msg: err.toString() }));
    return true;
  };

  next()
  // res.send(500, "Something broke. Try later.");
});


app.listen(port);
console.log('Listening on: ' + port);


// var http = require('http');
// var s = http.createServer(app);
// s.listen(port);
// s.on('close', tell);
// process.on('exit', tell);
// process.on('INT', tell);
// process.on('TERM', tell);
// process.on('SIGTERM', tell);


