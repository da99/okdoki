var _         = require('underscore')
, Topogo          = require('okdoki/lib/Topogo.js')
, Customer    = require('okdoki/lib/Customer').Customer
, River       = require('okdoki/lib/River').River
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, Chat_Bot    = require('okdoki/lib/Chat_Bot').Chat_Bot
, log         = require('okdoki/lib/base').log
;

var shutting_down = false;
var tell = function () { log(' ---- '); };

var _               = require('underscore');
var password_hash   = require('password-hash');
var shortid         = require('shortid');
var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var testing         = process.env.TESTING;

passport.use(new LocalStrategy( {
  usernameField: 'screen_name',
  passwordField: 'pass_phrase'
}, function (screen_name, pass_phrase, done) {
  Customer.read({screen_name: screen_name, pass_phrase: pass_phrase }, function (c) {
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


app.use(function (req, resp, next) { // must go on top of other middleware
  if (toobusy()) {
    log('Too busy to send: ' + req.path);
    if (req.accepts('json'))
      write_json_fail(resp, "Too busy", 503, {too_busy: true});
    else
      resp.send(503, "Website is busy right now. Try again later.");
  } else
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

// =========================== Testing purposes
//
if (testing) {
  app.get('/disconnect', function (req, resp) {
    setTimeout(function () {
      log('Exiting server process to test disconnection errors.');
      process.exit(0);
    }, 2000);
    write_json_success(resp, "Disconnecting in 2 seconds.");
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

  app.get('/now', function (req, resp) {

    var query = new db.query("SELECT NOW() as when", [], function(result) {
      resp.writeHead(200, { "Content-Type": "text/plain" });
      resp.end("" + result.rows[0].when);
    });

  });


} // end if testing

// =========================== index/frontpage
//
app.get('/', function (req, resp) {
  var opts = default_view_opts('index', req, resp)
  if (opts.logged_in) {
    opts['title'] = "Your OKdoki Homepage(s)";
  } else {
    opts['title'] = 'OkDoki.com';
  };

  resp.render(opts['view_name'], opts);
});


// ****************************************************************
// *************** READ POSTS *************************************
// ****************************************************************

app.get( '/news-feed', function (req, resp, next) {
  if (!req.user)
    return write_json_success(resp, "You need to be logged in.", {items: []});

  New_River(next)
  .job('read_feed', req.user.data.id, [Post, 'read_feed', req.user])
  .run(function (r) {
    write_json_success(resp,"Here is your feed.", {items: r.flatten_results()});
  });
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

app.get('/info/:name', function (req, resp, next) {
  var n = req.params.name;

  New_River(next)
  .job('read:', n, [Customer, 'read_by_screen_name', n])
  .set('not_found', function (r) {
    write_html(resp, "<html><body>Screen name not found: " + n + "</body></html>", 404);
  })
  .create_on('final finish', function (r) {
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
  })
  .set_finish(function (r) {
    var r.data.owner = r.reply_for('read:', n);

    if (!req.user)
      return r.emit('final finish');

    New_River(next)
    .job('read_contacts_for', r.data.owner.screen_name_id(n), function (j) {
      req.user.read_contacts_for(j.id, j);
    })
    .set_finish(function (final_r) {
      r.emit('final finish');
    })
    .run();

  })
  .run();


});

app.get('/keywords/:keywords', function (req, resp, next) {
  var opts                        = default_view_opts('keywords', req, resp);
  opts.title                      = req.param('keywords');
  opts.homepage_belongs_to_viewer = false;
  opts.keywords                   = req.param('keywords');
  opts.results                    = [ {href: '/info/go99/id/2', title: 'result 1', abstract: 'Summary'}, {href: '/info/go99/id/3', title: 'result 2', abstract: 'Summary 2'}];
  resp.render(opts['view_name'], opts);
});

app.get('/info/:name/id/:id', function (req, resp) {
  var article = {
    'author'          : req.param('name'),
    'title'           : "Some Title 1",
    'post_type'       : 'emergency',
    'body'            : "Body goes here.",
    'created_at'      : (new Date).getTime(),
    'custom_keywords' : 'some keyword',
    'main_keyword'    : 'jokes',
    'keywords'        : req.param('name') + ' some keyword'
  };
  var opts = default_view_opts('article', req, resp);
  opts.article = article;
  opts.title = article.title;
  opts.homepage_belongs_to_viewer = false;
  opts.logged_in = false;
  resp.render(opts['view_name'], opts);
});

// ****************************************************************
// ****************** Authentication ******************************
// ****************************************************************

app.get('/log-out', function (req, resp, next) {
  req.logout();
  resp.redirect('/');
});

app.post('/sign-in', function (req, resp, next) {

  if (!req.body.screen_name || req.body.screen_name.trim().length == 0 )
    return write_json( resp, { msg: "Screen name is required.", success: false } );

  if (!req.body.pass_phrase || req.body.pass_phrase.trim().length == 0 )
    return write_json( resp, { msg: "Password is required.", success: false } );

  passport.authenticate('local', function(err, user, info) {

    if (err)
      return next(err);

    if (!user) {
      return write_json( resp, { msg: "Screen name/pass phrase was wrong. Check your spelling.", success: false } );
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
  if (!req.user)
    return write_json_fail(resp, "You are not logged in.");

  var n = req.params.name;
  var r = New_River(next);
  r
  .job('read_by_screen_name', n, [Customer, 'read_by_screen_name', n])
  .job('prepare-post', n, function (j, c) {
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

    j.river.data({
      msg       : msg,
      customer  : c,
      post_vals : vals
    });

    j.finish();
  })

  .next('invalid', function (j) {
    write_json_fail(resp, j.invalid_msg);
  })
  .job('create_post', n, function (j) {
    var c = j.river.data('customer');
    Post.create(c, j.river.data('post_vals'), j);
  })

  .on_finish(function (r) {
    var record = r.last_reply();
    write_json_success(resp, r.data('msg'), {rows: [record.public_data()]});
  })

  .run();

});


app.post('/create-account', function (req, resp, next) {

  var data = req.body;

  var vals = {
    screen_name        : data.screen_name,
    pass_phrase         : data.pass_phrase,
    confirm_pass_phrase : data.confirm_pass_phrase,
    email              : data.email,
    ip                 : req.ip
  };

  var r = New_River(next);
  r

  .next('invalid', function (j) {
    write_json_fail(resp, j.invalid_msg);
  })
  .job('create-customer', vals.screen_name, [Customer, 'create', vals])

  .run(function (r, save_customer) {
    req.login(mem, function(err) {
      if (err)
        return next(err);
      return write_json_success(resp, "Account created.");
    });
  });


});

app.post('/create/screen_name', function (req, resp, next) {
  var n = req.body.screen_name;
  New_River(next)
  .next('invalid', function (j) {
    return write_json_fail(resp, j.invalid_msg);
  })
  .job('create-screen-name', [Screen_Name, 'create', req.user, n])

  .run(function () {
    write_json_success(resp,
                       "Screen name created: " + n + '. Please wait as homepage loads.', 
                       { screen_name: n }
                      );
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
                        'at_pass_phrase',
                        'bot_url',
                        'bot_pass_phrase'
                       );

  var r = New_River(next);

  r

  .next('invalid', function (j) {
    write_json_fail(resp, j.invalid_msg);
  })
  .job('update screen name:', n, [Screen_Name, 'update', req.user, n, new_vals]);

  .run(function (r) {

    var c   = req.user;
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
      if (k.indexOf('pass_phrase') > -1 && (public[k] || '').trim().length > 0)
        public[k] = '[hidden]';
    });

    write_json_success(resp, msg, {updated: public});
  });

});

// ****************************************************************
// *************** DELETE/TRASH ***********************************
// ****************************************************************

app.post('/undo/trash/screen_name/:name', function (req, resp, next) {
  var n = req.params.name;
  var r = New_River(next);
  r
  .job('undo trash screen name', n, [Screen_Name, 'undo_trash', req.user, n])
  .run(function () {
    write_json_success(resp, "Screen name, " + n + ", has been taken out of the trash.");
  });
});

app.post('/trash/screen_name/:name', function (req, resp, next) {
  var name = req.params.name;
  var r = New_River(next);
  r
  .job('trash screen name', n, [Screen_Name, 'trash', req.user, n])
  .run(function () {
    write_json_success(resp, c.screen_name_row(name).trash_msg);
  });
});


// ****************************************************************
// ****************** CHAT ****************************************
// ****************************************************************


app.get( '/chat', require_log_in, function (req, resp) {
  var opts   = default_view_opts('chat', req, resp);
  opts.lifes = req.user.screen_names();
  opts.title = "Chat";
  resp.header('CSRF-TOKEN', req.session._csrf);
  resp.render(opts['view_name'], opts);
});


app.post("/chat/heart-beep", require_log_in, function (req, resp, next) {
  var dev_ip = '127.0.0.1';
  var is_dev = dev_ip === req.ip;

  var expires = []
  , R         = Redis.client
  , user      = req.user
  , since     = since_OST()
  , m         = null
  , delete_old= false
  , cmd_q     = []
  , new_messages = []
  ;

  var secs   = 4; // How many seconds for next heart beep.
  var status = 200;

  // Save message.
  if (is_dev && !req.body.message) {
    req.body.message = {message_body: 'No message.', owner_screen_name: req.user.screen_names()[0]};
  }

  var obj = {
    menu    : {},
    message : req.body_message,
    msgs    : new_messages
  };

  var r = New_River(next);

  _.each(req.user.screen_names(), function (n, i) {

    var s = Screen_Name.new(n);

    r.job('refresh:', n, function (r) {
      s.heart_beep(r);
    });

    r.job('ims for:', n, function (r) {
      s.read_messages(r);
    });

    r.job('delete old ims for:', n, function (r) {
      s.delete_old_ims(r);
    });

    var im = req.body.message;
    if (im && im.owner_screen_name === n) {
      r.job('create im by:', n, function (r) {
        s.create_im(im, r);
      });
    }

  });

  r.run(function () {
    obj.msgs    = _.compact(_.flatten(r.replys_for('ims for:'), 1));
    obj.message = r.reply_for('create im by:');
    write_json_success(resp, "Fin.", obj);
  });

}); // app.post /chat/heart-beep



// ****************************************************************
// ****************** CONTACTS ************************************
// ****************************************************************

app.post("/contacts/online", require_log_in, function (req, resp, next) {

  New_River(next)

  .job('contact is online', req.user.data.id, [Contact, 'is_online', req.user]);
  .on_finish(function (r) {
    return write_json_success(resp, 'FIN.', {contacts: r.last_reply()});
  })
  .run();

});

app.put("/contacts/:contact_user_name", function (req, resp, next) {
  var new_vals = {
    contact_screen_name: req.params.contact_screen_name,
    as: req.body.as,
    is_trashed: req.body.is_trashed
  };

  var r = New_River(next);
  r.job('update contact', new_vals.contact_screen_name, [Contact, 'update', req.user, new_vals]);
  r.run(function () {
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
    opts.screen_names = req.user.screen_names();

  return opts;
}

exports.app    = app;
exports.port   = port;
exports.server = server;

// setInterval(Chat_Bot.send_ims, 4000);






