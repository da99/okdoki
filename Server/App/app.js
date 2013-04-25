var blade = require('blade');


// ================================================================
// ================== Require the Packages ========================
// ================================================================


var _         = require('underscore')
, Topogo      = require('topogo').Topogo
, River       = require('da_river').River
;

var Customer  = require('../Customer/Customer').Customer
, Screen_Name = require('../Screen_Name/Screen_Name').Screen_Name
, Chat_Bot    = require('../Chat/Chat_Bot').Chat_Bot
;

var OK          = require('./router').OK
, log         = require('./base').log
, write       = require('./helpers/write').write
, homepage    = require('./helpers/homepage').homepage
;


var password_hash = require('password-hash')
, passport        = require('passport')
, LocalStrategy   = require('passport-local').Strategy
;

var express = require('express');
var toobusy = require('toobusy');
var app     = express();

OK.engine(app);



// ================================================================
// ================== Basic Options ==============================*
// ================================================================


var shutting_down = false;
var tell = function () { log(' ---- '); };

var app_dir = __dirname.split('/');
app_dir.pop();
app_dir = app_dir.join('/');

var port    = process.env.PORT || 5555;
var secret  = process.env.SESSION_SECRET;
var db_conn = process.env.DATABASE_URL;
var ip_addr = process.env.NODE_IP_FOR_AUTH;

if (!secret)
  throw new Error('No session secret set.');
if (!db_conn)
  throw new Error('No db conn string set.');
if (!ip_addr)
  throw new Error('No ip auth set.');


app.configure(function () {

  // Settings:
  app.set('view engine', 'blade');
  app.set('views', app_dir + '/Client/applets');
  app.locals.pretty = true;

  // ================================================================
  // ================== Middleware==================================*
  // ================================================================

  // Close persistent client connections:
  app.use(function (req, resp, next) {
    if (shutting_down)
      resp.setHeader('Connection', 'close');
    next();
  });

  // Logging:
  if (process.env.IS_DEV)
    app.use(express.logger('dev'));

  // Too busy:
  app.use(function (req, resp, next) { // must go on top of other middleware
    if (toobusy()) {
      log('Too busy to send: ' + req.path);
      if (req.accepts('json'))
        write.json_fail(resp, "Too busy", 503, {too_busy: true});
      else
        resp.send(503, "Website is busy right now. Try again later.");
    } else
      next();
  });

  // app.use(express.errorHandler());


  // Static files:
  // app.use(express.favicon(app_dir + '/public/favicon.ico'));
  // app.use('/assets', express.static(app_dir + '/public/assets' ));

  // Dynamic stuff:
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());

  // Session:
  app.use(express.cookieSession({secret: secret + secret}));
  app.use(express.csrf());

  // Passport:
  // Must go after session middleware.
  app.use(passport.initialize());
  app.use(passport.session());

  // Caching:
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

  app.use(app.router)


});


// ================================================================
// ================== Passport Config: ============================
// ================================================================

passport.serializeUser(function (user, done) { done(null, user.data.id); });

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

passport.use(new LocalStrategy( { usernameField: 'screen_name', passwordField: 'pass_phrase' }, function (screen_name, pass_phrase, done) {
  Customer.read({screen_name: screen_name, pass_phrase: pass_phrase }, function (c) {
    c.read_screen_names(function () {
      done(null, c);
    });
  }, function () {
    done(null, false, {message: "Not found."});
  });
}));

// ================================================================
// ================== Helpers: ====================================
// ================================================================

var require_log_in = function (req, resp, next) {
  if (!req.user)
    return resp.redirect(307, "/");
  next();
};


// ================================================================
// ================== Routes: ====================================*
// ================================================================


// if (process.env.TESTING) {
  // require('./routes/Test');
// }

// _.each(['Site', 'Chat', 'Posts', 'Screen_Names'], function (name) {
  // require('./routes/' + name);
// });
// app.get('/', function (req, resp, next) {
  // // resp.render('index', {title: "somet", template_name: "index", logged_in: false});
  // resp.header("Last-Modified", "Thu, 16 Nov 1995 04:59:09 GMT");
  // resp.send(200, "huuuml");
// });
require('../Site/routes');

// ================================================================
// ==================== HOMEPAGE ==================================
// ================================================================

app.get('/info/:name/list/qa', homepage.list({read: 'question', no_rows: "No questions/answers posted yet."}));
app.get('/info/:name/list/cheers-boos', homepage.list({read: 'cheers/boos', no_rows: "No cheers/boos posted yet."}));
app.get('/info/:name/list/posts', homepage.list({read: 'posts', no_rows: "No content posted yet."}));

app.get('/info/:name', function (req, resp, next) {
  var n = req.params.name;

  New_River(next)
  .job('read:', n, [Customer, 'read_by_screen_name', n])
  .set('not_found', function (r) {
    write.html(resp, "<html><body>Screen name not found: " + n + "</body></html>", 404);
  })
  .create_on('final finish', function (r) {
    var opts              = default_view_opts('info', req, resp);
    opts.owner            = owner;
    opts.screen_name      = n;
    opts.screen_name_info = owner.screen_name_row(n);
    opts.title            = n;
    opts.life_name        = n;
    opts.contact_menu     = (req.user && req.user.data.contact_menu) || {};

    var priv = homepage.priv(req.user, owner, opts.screen_name_info);
    opts.homepage_belongs_to_viewer = priv.homepage_belongs_to_viewer;

    if (priv.allow)
      return resp.render(opts['template_name'], opts);

    return write.html(resp, '<html><body>' + priv.msg + '</body></html', 404);
  })
  .set_finish(function (r) {
    r.data.owner = r.reply_for('read:', n);

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
  resp.render(opts['template_name'], opts);
});








// ================================================================
// ================== CONTACTS ====================================
// ================================================================

app.post("/contacts/online", require_log_in, function (req, resp, next) {

  New_River(next)
  .job('contact is online', req.user.data.id, [Contact, 'is_online', req.user])
  .on_finish(function (r) {
    return write.json_success(resp, 'FIN.', {contacts: r.last_reply()});
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
    write.json_success(resp, "Saved.");
  });
});



// ================================================================
// ================== ERRORS ======================================
// ================================================================

app.use(function (req, resp, next) {
  log('params: ', req.params)
  log('body: ', req.body)

  if (req.accepts('html')) {
    resp.writeHead(404, { "Content-Type": "text/html" });
    resp.end("<html><head><title>" + req.path + " : Not Found</title></head><body>Missing url. Check spelling of the address.</body></html>");
  } else {
    if (req.accepts('application/json'))
      write.json_fail(resp, "Page not found.", 404)
    else {
      resp.writeHead(404, { "Content-Type": "text/plain" });
      resp.end(req.path + " : Not Found. Check spelling of the address.");
    }
  }
});



app.use(function (err, req, resp, next) {
  log(err);

  if (req.body && req.body.request_type == 'latest msgs') {
    write.json( resp, { _csrf: req.session._csrf, success: false, msg: err.toString() } );
    return true;
  };

  resp.send((err.status || 500), "Something broke. Try later.");
});



// =================================================================================
app.listen(port, function () {
  log('Listening on: ' + port);
});

function screen_names(arr) {
  var names = {first: arr[0], list: arr, multi : (arr.length != 1) };
  return names;
};


exports.app    = app;

// setInterval(Chat_Bot.send_ims, 4000);






