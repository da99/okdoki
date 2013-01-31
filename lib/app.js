var db     = require('okdoki/lib/POSTGRESQL.js')
, Customer = require('okdoki/lib/Customer').Customer
, redis    = require('redis');

function log() {
  console['log'].apply(console, arguments);
}

var shutting_down = false;
var tell = function () { log(' ---- '); };

var _               = require('underscore');
var password_hash   = require('password-hash');
var shortid         = require('shortid');
var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var test_disconnect = process.env.TEST_DISCONNECT;
var redis_client    = redis.createClient(5100);

passport.use(new LocalStrategy( {
  usernameField: 'screen_name',
  passwordField: 'passphrase'
}, function (screen_name, passphrase, done) {
  Customer.read({screen_name: screen_name, passphrase: passphrase }, function (c) {
    c.read_screen_names(function () {
      done(null, c);
    });
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
app.use(express.methodOverride());
app.locals.pretty = true;
app.use(express.cookieParser());
app.use(express.cookieSession({secret: secret + secret}));
app.use(express.csrf());

app.use(passport.initialize());
// Must go after session middleware.
app.use(passport.session());


app.configure(function () {
  app.set('view engine', 'jade');
  app.set('views', app_dir + '/views');
});

app.use(function (req, resp, next) {
  if (shutting_down) {
    resp.setHeader('Connection', 'close');
  }
  next();
});

app.use(function (req, resp, next) {
  if (req.accepts('html')) {
    resp.set("Expires", "Tue, 03 Jul 2001 06:00:00 GMT");
    resp.set("Last-Modified", "Wed, 15 Nov 1995 04:58:08 GMT");
    resp.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    resp.set("Cache-Control", "post-check=0, pre-check=0");
    resp.set("Pragma", "no-cache");
  }
  next();
});
var require_log_in = function (req, resp, next) {
  if (!req.user)
    return resp.redirect(307, "/");
  next();
};


function write_plain(r, txt) {
  resp.writeHead(200, { "Content-Type": "text/plain" });
  resp.end(txt);
}

function write_html(resp, o, stat) {
  resp.writeHead((stat || 200), { "Content-Type": "text/html" });
  resp.end(o);
}

function write_json(resp, o) {
  resp.writeHead(200, { "Content-Type": "application/json" });
  resp.end(JSON.stringify(o));
}

function write_json_success(resp, msg, o) {
  if (!o)
    o = {};
  o.msg     = msg;
  o.success = true;
  write_json(resp, o);
}

function write_json_fail(resp, msg, stat, o) {
  if (!o)
    o = {};
  o.msg     = msg;
  o.success = false;
  write_json(resp, o, (stat || 404));
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
app.get('/', function (req, resp) {
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


// ****************************************************************
// *************** READ HOMEPAGE **********************************
// ****************************************************************


app.get('/info/:name/list/qa', homepage_list({read: 'question', no_rows: "No questions/answers posted yet."}));
app.get('/info/:name/list/cheers-boos', homepage_list({read: 'cheers/boos', no_rows: "No cheers/boos posted yet."}));
app.get('/info/:name/list/posts', homepage_list({read: 'posts', no_rows: "No content posted yet."}));


function homepage_list(o) {
  if (!o.no_rows)
    throw new Error('Msg for no_rows required: ' + o);
  if (!o.read)
    throw new Error('Method for reading required: ' + o);

  return function (req, resp, next) {
    var n = req.params.name;
    Customer.read_by_screen_name(n, function (owner) {
      var priv = homepage_priv(req.user, owner, owner.screen_name_row(n));
      if (!priv.allow)
        return write_json(resp, {success: false, msg: priv.msg});
      else {
        owner.read_posts(o.read, n, req.user, function (rows) {
          if (rows.length === 0)
            return write_json(resp, {success: true, msg: o.no_rows, rows: [] });
          else
            return write_json(resp, {success: true, msg: priv.msg, rows: rows });
        });
      }
    });
  }
}

function homepage_priv(customer, owner, screen_name_row) {
  if (!customer)
    customer = {data : {id: null} };

  var r    = screen_name_row;
  var n    = r.screen_name;
  var meta = {};
  meta.homepage_belongs_to_viewer = customer.data.id === (owner.data.id);
  meta.is_trashed = r.trashed_at;

  if (meta.homepage_belongs_to_viewer) {
    meta.allow = true;
    meta.msg     = 'Homepage belongs to audience member.';
    return meta;
  }

  if (r.trashed_at) {
    meta.allow = false;
    meta.msg     = 'Screen name not found: ' + n;
    return meta;
  }


  if (r.read_able === 'W') {
    meta.allow = true;
    meta.msg     = 'Homepage is read-able by the World.';
    return meta;
  }

  meta.allow = false;
  meta.msg = 'Homepage is private: ' + n;
  return meta;

}

app.get('/info/:name', function (req, resp) {
  var n = req.params.name;

  Customer.read_by_screen_name(n, function (owner) {

    var on_fin = function () {
      var opts              = default_view_opts('info', req, resp);
      opts.owner            = owner;
      opts.screen_name      = n;
      opts.screen_name_info = owner.screen_name_row(n);
      opts.title            = n;
      opts.life_name        = n;
      opts.contact_menu     = (req.user && req.user.data.contact_menu) || {};

      var priv = homepage_priv(req.user, owner, opts.screen_name_info);
      opts.homepage_belongs_to_viewer = priv.homepage_belongs_to_viewer;

      if (priv.allow)
        return resp.render(opts['view_name'], opts);

      return write_html(resp, '<html><body>' + priv.msg + '</body></html', 404);
    };

    if (req.user)
      req.user.read_contacts_for(owner.screen_name_id(n), on_fin);
    else
      on_fin();

  }, function () {
    write_html(resp, "<html><body>Screen name not found: " + n + "</body></html>", 404);
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


// ****************************************************************
// *************** CREATE *****************************************
// ****************************************************************

app.post('/post/:name', function (req, resp, next) {
  var n = req.params.name;
  Customer.read_by_screen_name(n, function (c) {

    var vals = {
      ip                   : req.ip,
      customer_screen_name : n,
      author               : req.user,
      author_screen_name   : req.body.as,
      body                 : req.body.post_body,
      section_name         : req.body.section_name
    };

    var msg = null;
    switch (req.body.section_name) {
      case 'question':
        msg = "Question has been saved."
      break;
      case 'cheer':
        msg = "You have cheered this person."
      break;
      case 'jeer':
        msg = "You have boo-ed this person."
      break;
      default:
        msg = "Saved."
    };
    c.create_post(vals, function (record) {
      write_json(resp, {success: true, msg: msg, rows: [record.data]});
    }, function (errors) {
      write_json(resp, {success: false, msg: errors.join(' ')});
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
      return next(new Error("Unknown error. Contact website owner to fix this."));
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

// ****************************************************************
// *************** UPDATE *****************************************
// ****************************************************************

app.put('/screen_names/:name', function (req, resp, next) {
  var n = req.params.name;
  var new_vals = _.pick(req.body,
                        'read_able',
                        'read_able_list',
                        'about',
                        'at_url',
                        'at_passphrase',
                        'bot_url',
                        'bot_passphrase'
                       )

  req.user.update_screen_name(n, new_vals, function (c) {

    var msg = null;

    switch (c.sanitized_data.read_able) {
      case 'W':
        msg = "Updated settings: Anyone online may see this homepage.";
        break;
      case 'N':
        msg = "Updated settings: no one but you can see this homepage.";
        break;
      case 'S':
        msg = "Updated settings: The following may see your homepage: " + c.sanitized_data.read_able_list.join(', ');
        break;
      default:
        if (c.sanitized_data.about) {
        msg = 'Your "About Me" section has been updated.';
      } else if (c.sanitized_data.new_screen_name) {
        msg = 'Your screen name has been updated.';
      } else {
        msg = 'Your web app info has been updated.';
      };

    };

    var public = {};
    _.each(new_vals, function (v, k) {
      if (c.sanitized_data.hasOwnProperty(k))
        public[k] = c.sanitized_data[k];
      if (k.indexOf('passphrase') > -1 && (public[k] || '').trim().length > 0)
        public[k] = '[hidden]';
    });

    write_json(resp, {success: true, msg: msg, updated: public });
  }, function (c) {
    write_json(resp, {success: false, msg: c.errors.join(' ') });
  });
});

// ****************************************************************
// *************** DELETE/TRASH ***********************************
// ****************************************************************

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


// ****************************************************************
// ****************** CHAT ****************************************
// ****************************************************************

app.get( '/chat', require_log_in, function (req, resp) {
  var opts   = default_view_opts('chat', req, resp);
  opts.lifes = req.user.data.screen_names;
  opts.title = "Chat";
  resp.header('CSRF-TOKEN', req.session._csrf);
  resp.render(opts['view_name'], opts);
});

app.post("/chat/heart-beep", require_log_in, function (req, resp, next) {
  log(req.ip)
  var kvs   = []
  , expires = []
  , client  = redis_client.multi()
  , user    = req.user
  , id_prefix = '';

  _.each(user.data.screen_names, function (v, i) {
    var id = id_prefix + v;
    kvs.push(id);
    kvs.push(1);
    expires.push([id, 7]);
  });

  client.mset(kvs);

  _.each(expires, function (r) {
    client.expire(r);
  });

  client.exec(function (err, replies) {
    if (err)
      return next(err);
    write_json_success(resp, "Fin.", {menu: {}});
  });
});


// ****************************************************************
// ****************** CONTACTS ************************************
// ****************************************************************

app.post("/contacts/online", require_log_in, function (req, resp, next) {

  var client = redis_client;
  var o_into_contacts = [];
  var c_into_owner    = [];
  var o_menu          = {};
  var c_menu          = {};
  var menu_by_c       = null;
  var menu_by_o       = null;
  var id_prefix       = '';
  var contacts        = null;
  var contact_rids    = null;
  var online_contacts = null;

  var log_it = function (err, write) {
    if (err) {
      log(err);
      // return next(err);
    }
    if (write)
    return write_json_fail(resp, "Try next time..", 200, {menu: {}});
  }

  req.user.read_mutual_contacts(function (rows, menu_by_contact, menu_by_owner) {

    menu_by_c    = menu_by_contact;
    menu_by_o    = menu_by_owner;
    contacts     = _.keys(menu_by_contact);
    contact_rids = _.map(contacts, function (v, i) {
      return id_prefix + v;
    });

    _.each(menu_by_owner, function (c_list, owner_name) {
      o_menu[owner_name] = {};
      c_menu[contact_name] = {};
      _.each(c_list, function (contact_name) {
        o_into_contacts.push( [owner_name, contact_name] );
        c_into_owner.push( [contact_name, owner_name] );

        o_menu[owner_name][contact_name] = 1;
        c_menu[contact_name][owner_name] = 1;
      });
    });

  });


  // See who is online.
  // Then, start inserting.
  client.mget(contact_rids, function (err, result) {

    if (err)
      return log_it(err, true);

    online_contacts = result;

    var multi = null;
    var one_online = false;

    _.each(online_contacts, function (v, i) {
      if (!v)
        return;
      if (!multi)
        multi = redis_client.multi();

      var c_name       = contacts[i];
      var id           = contact_rids[i];
      var contact_menu = {};

      // Insert EACH owner into contacts[i]:
      _.each(o_menu, function (c_hash, o_name) {
        if (c_hash[c_name]) {
          contact_menu[o_name] = 1;
          var o = {}
          o[c_name] = 1;
          // Insert contact into owner;
          multi.hmset(id_prefix + o_name, o);
        }
      });

      multi.hmset(id, contact_menu);

    });

    var o   = {menu: menu_by_c};
    var msg = 'FIN.';

    if (!multi)
      return write_json_success(resp, msg, o);

    multi.exec(function (err, replys) {
      if (err)
        log_it(err);
      return write_json_success(resp, msg, o);
    });

  });

});

app.put("/contacts/:contact_user_name", function (req, resp, next) {
  var new_vals = {
    contact_screen_name: req.params.contact_user_name,
    as: req.body.as
  };

  req.user.update_contacts( new_vals, function (meta) {
    write_json_success(resp, "Saved.");
  });

});



// ****************************************************************
// ****************** ERRORS **************************************
// ****************************************************************

app.use(function (req, resp, next) {
  log('params: ', req.params)
  log('body: ', req.body)

  if (req.accepts('html')) {
    resp.writeHead(404, { "Content-Type": "text/html" });
    resp.end("<html><head><title>" + req.path + " : Not Found</title></head><body>Missing url. Check spelling of the address.</body></html>");
  } else {
    if (req.accepts('application/json'))
      write_json_fail(resp, "Page not found.", 404)
    else {
      resp.writeHead(404, { "Content-Type": "text/plain" });
      resp.end(req.path + " : Not Found. Check spelling of the address.");
    }
  }
});

app.use(function (err, req, resp, next) {

  log(err);

  if (req.body && req.body.request_type == 'latest msgs') {
    write_json( resp, { _csrf: req.session._csrf, success: false, msg: err.toString() } );
    return true;
  };

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
    view_name    : name,
    logged_in    : !!req.user,
    customer     : req.user,
    screen_names : [],
    token        : req.session._csrf,
    aud          : req.user
  };

  if (opts.logged_in)
    opts.screen_names = req.user.data.screen_names;

  return opts;
}

exports.app    = app;
exports.port   = port;
exports.server = server;








