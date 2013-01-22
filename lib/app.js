var db = require('okdoki/lib/POSTGRESQL.js');
var Customer = require('okdoki/lib/Customer').Customer;

function log() {
  console['log'].apply(console, arguments);
}

var shutting_down = false;
var tell = function () { log(' ---- '); };

var password_hash = require('password-hash');
var shortid       = require('shortid');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var test_disconnect = process.env.TEST_DISCONNECT;

passport.use(new LocalStrategy( {
  usernameField: 'screen_name',
  passwordField: 'passphrase'
}, function (screen_name, passphrase, done) {
  Customer.read({screen_name: screen_name, passphrase: passphrase }, function (c) {
    done(null, c);
  }, function () {
    done(null, false, {message: "Not found."});
  });
}
                              ));

passport.serializeUser(function (user, done) {
  done(null, user.data.id);
});

passport.deserializeUser(function (id, done) {
  var on_err = function (err) {
    done(null, false, {message: "Not found."});
  };

  Customer.read(id, function (c) {
    c.read_screen_names(function () {
      done(null, c);
    }, on_err);
  }, on_err);
});


var express = require('express');
var toobusy = require('toobusy');
var app     = express();
var port    = process.env.PORT || 5555;
var secret  = process.env.SESSION_SECRET;
var db_conn = process.env.DATABASE_URL;
var ip_addr = process.env.NODE_IP_FOR_AUTH;

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


app.use(function (req, resp, next) {
  if (toobusy())
    resp.send(503, "Website is busy right now. Try again later.");
  else
    next();
});

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

function write_html(resp, o) {
  resp.writeHead(200, { "Content-Type": "text/html" });
  resp.end(o);
}

function write_json(resp, o) {
  resp.writeHead(200, { "Content-Type": "application/json" });
  resp.end(JSON.stringify(o));
}

function get_latest_msg(req, resp) {
  var query = new db.query("SELECT * FROM bot_chat WHERE date > $1", [req.body.date], function (meta) {

    var result = meta.rows;
    if (meta.rowCount > 0)
      write_json( resp, { msg: result, success: true, refresh: 10 } );
    else
      write_json( resp, { msg: [], success: true, refresh: 10 } );

  });

  query.run()
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
        var query = new db.query(text, vals, function (err, meta) {

          if (meta.rowCount) {
            get_latest_msg(req, resp)
            // resp.end(JSON.stringify({ msg: { msg: req.param('msg'), id: meta.rows[0].id, author: req.param('author') }, success: true, refresh: 6 }));
          } else {
            write_json( resp, { msg: "Failed.", success: false, refresh: 6 } );
          }

        });

        query.run();

      } else  {
        write_json( resp, { msg: "inserted", success: true, refresh: 600000 } );
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
      write_json( resp, { success: false, msg: 'Unknown request type.' } );
  }

});

app.get( '/news-feed', function (req, resp) {
  req.user.read_feed(function (rows) {
    var o = {success: true, items: rows, msg: "Your feed is ready to be read."};
    return write_json( resp, o );
  });
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


// =========================== index/frontpage
app.get( '/', function (req, resp) {
  var opts = default_view_opts('index', req, resp)
  if (opts.logged_in) {
    opts['title'] = "Your OKdoki Homepage(s)";
  } else {
    opts['title'] = 'OkDoki.com';
  };

  resp.render( opts['view_name'], opts);

  if (test_disconnect) {
    setTimeout(function () {
      log('Exiting server process to test disconnection errors.');
      process.exit(0);
    }, 2000);
  }
});

app.get( '/info/:name', function (req, resp) {
  var n = req.params.name;

  Customer.read_by_screen_name(n, function (owner) {
    var opts                        = default_view_opts('info', req, resp);
    opts.owner                      = owner;
    opts.screen_name                = n;
    opts.screen_name_info           = owner.screen_name_row(n);
    opts.title                      = n;
    opts.life_name                  = n;
    opts.homepage_belongs_to_viewer = owner.data.id === (req.user && req.user.data.id);
    resp.render(opts['view_name'], opts);
  }, function () {
    write_html("<html><body>Screen name not found: " + n + "</body></html>");
  });

});

app.get('/keywords/:keywords', function (req, resp) {
  var opts = default_view_opts('keywords', req, resp);
  opts.title = req.param('keywords');
  opts.homepage_belongs_to_viewer = false;
  opts.keywords = req.param('keywords');
  opts.results = [ {href: '/info/go99/id/2', title: 'result 1', abstract: 'Summary'}, {href: '/info/go99/id/3', title: 'result 2', abstract: 'Summary 2'}];
  resp.render(opts['view_name'], opts);
});

app.get('/info/:name/id/:id', function (req, resp) {
  var article = {
    'author' : req.param('name'),
    'title': "Some Title 1",
    'post_type': 'emergency',
    'body' : "Body goes here.",
    'created_at' : (new Date).getTime(),
    'custom_keywords' : 'some keyword',
    'main_keyword' : 'jokes',
    'keywords' : req.param('name') + ' some keyword'
  };
  var opts = default_view_opts('article', req, resp);
  opts.article = article;
  opts.title = article.title;
  opts.homepage_belongs_to_viewer = false;
  opts.logged_in = false;
  resp.render(opts['view_name'], opts);
});

app.get( '/chat', function (req, resp) {
  resp.header('CSRF-TOKEN', req.session._csrf);
  resp.render('chat', {logged_in: true, lifes: ['go99'], screen_name: 'go99', view_name: 'chat', title: "Chat", token: req.session._csrf});
});

// app.get( '/login', function (req, resp) {
  // resp.render('login', {title: 'Login', token: req.session._csrf});
// });


app.get('/now', function (req, resp) {

  var query = new db.query("SELECT NOW() as when", [], function(result) {
    resp.writeHead(200, { "Content-Type": "text/plain" });
    resp.end("" + result.rows[0].when);
  });

});

app.get('/log-out', function (req, resp, next) {
  req.logout();
  resp.redirect('/');
});

app.post('/sign-in', function (req, resp, next) {

  if (!req.body.screen_name || req.body.screen_name.trim().length == 0 )
    return write_json( resp, { msg: "Screen name is required.", success: false } );

  if (!req.body.passphrase || req.body.passphrase.trim().length == 0 )
    return write_json( resp, { msg: "Password is required.", success: false } );

  passport.authenticate('local', function(err, user, info) {

    if (err)
      return next(err);

    if (!user) {
      return write_json( resp, { msg: "Screen name/passphrase was wrong. Check your spelling.", success: false } );
    }

    req.login(user, function(err) {
      if (err)
        return next(err);
      write_json( resp, { msg: "You are now sign-ed in. Please wait as page reloads...", success: true } );
    });

  })(req, resp, next);

  return false;
});

app.post('/create/screen_name', function (req, resp, next) {
  if (!req.user)
    return write_json(resp, {msg: "Please sign-in first.", success: false});
  var n = req.body.screen_name;
  req.user.create_screen_name(n, function () {
    return write_json(resp, {
      success: true,
      screen_name: n,
      msg: "Screen name created: " + n + '. Please wait as homepage loads.'
    });
  }, function (c) {
    return write_json(resp, {success: false, msg: c.errors.join(' ') });
  });
});

app.post('/undo/trash/screen_name/:name', function (req, resp, next) {
  var n = req.params.name;
  Customer.read_by_screen_name(n, function (c) {
    c.undo_trash_screen_name(n, function () {
      write_json(resp, {success: true, msg: "Screen name, " + n + ", has been taken out of the trash."});
    });
  });
});

app.post('/trash/screen_name/:name', function (req, resp, next) {
  var name = req.params.name;
  Customer.read_by_screen_name(name, function (c) {
    c.trash_screen_name(name, function () {
      write_json(resp, {success: true, msg: c.screen_name_row(name).trash_msg});
    });
  });
});

app.post('/create-account', function (req, resp, next) {

  var data = req.body;

  var vals = {
    screen_name        : data.screen_name,
    passphrase         : data.passphrase,
    confirm_passphrase : data.confirm_passphrase,
    email              : data.email,
    ip                 : req.ip
  };

  var mem = new Customer(vals);
  mem.create(function (meta) {
    if (meta.rowCount === 0) {
      log(err);
      write_json( resp, { msg: "Unknown error. Contact website owner to fix this.", success: false } );
    } else {
      req.login(mem, function(err) {
        if (err) {
          log(err)
          return next(err);
        }
        return write_json( resp, { msg: "Account created.", success: true } );
      });
    }
  }, function (c) {
    write_json( resp, { success: false, msg: c.errors.join(" ") } );
  });

});

app.use(function (req, resp, next) {
  resp.writeHead(404, { "Content-Type": "text/plain" });
  resp.end("Missing url. Check the address.");
});

app.use(function (err, req, resp, next) {

  log(err);

  if (req.body && req.body.request_type == 'latest msgs') {
    write_json( resp, { _csrf: req.session._csrf, success: false, msg: err.toString() } );
    return true;
  };

  // next()
  resp.send((err.status || 500), "Something broke. Try later.");
});


// =================================================================================
var server = app.listen(port, function () {
  log('Listening on: ' + port);
});


function screen_names(arr) {
  var names = {first: arr[0], list: arr, multi : (arr.length != 1) };
  return names;
};

function default_view_opts(name, req, resp) {
  var opts = { homepage_belongs_to_viewer: false,
    'view_name'  : name,
    logged_in    : !!req.user,
    customer     : req.user,
    screen_names : [],
    token        : req.session._csrf
  };

  if (opts.logged_in)
    opts.screen_names = req.user.data.screen_names;

  return opts;
}

exports.app    = app;
exports.port   = port;
exports.server = server;








