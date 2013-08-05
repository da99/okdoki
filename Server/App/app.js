

var blade     = require('blade');
var e_e_e     = require('escape_escape_escape').Sanitize.html;
var IS_DEV    = !!process.env.IS_DEV;
var RELOG_MSG = "This page has expired. You will have to refresh this page.";
var server    = null;
var F         = require('tally_ho').Tally_Ho;

// ================================================================
// ================== Events ======================================
// ================================================================

// ================================================================
// ================== Require the Packages ========================
// ================================================================


var _         = require('underscore')
, Topogo      = require('topogo').Topogo
, River       = require('da_river').River
;

var Customer     = require('../Customer/model').Customer
, Screen_Name    = require('../Screen_Name/model').Screen_Name
, H              = require('../App/Helpers').H
, OMNI           = require('../../Client/js/Screen_Name')
;

var log       = require('./base').log
;

var helmet = require('helmet');

var password_hash = require('password-hash');

var passport      = require('passport')
, LocalStrategy   = require('passport-local').Strategy
;

var ensure_login = require('connect-ensure-login');

var express = require('express');
var toobusy = require('toobusy');
var app     = module.exports.app = express();

var ALLOW_UNAUTH_PATHS = [];

// ================================================================
// ================== Helpers =====================================
// ================================================================

var mtimes = exports.mtimes = require("./file_times").data;

exports.allow_unauth_path = function (meth, path) {
  ALLOW_UNAUTH_PATHS.push(meth.toUpperCase() + ':' + path.toUpperCase());
};

exports.is_allow_unauth_path = function (req) {
  var i = ALLOW_UNAUTH_PATHS.indexOf(req.method.toUpperCase() + ':' + req.path.toUpperCase());
  return i > -1;
};

var resp_404 = exports.resp_404 = function (req, resp, msg) {
  return resp_error(req, resp, msg, 404);
};

var resp_error = exports.resp_error = function (req, resp, msg, stat) {
  if (req.accepts('html')) {
    stat = stat || 200;
    return resp.status(stat).render('Error/error', {msg: msg});
  } else
    return resp.json({success: false, msg: msg});
};

var resp_invalid = exports.resp_invalid = resp_error;




// ================================================================
// ================== Basic Options ==============================*
// ================================================================


var shutting_down = false;
var tell = function () { log(' ---- '); };

var app_dir = __dirname.split('/');
app_dir.pop();
app_dir.pop();
app_dir = app_dir.join('/');

var port    = process.env.PORT || 5555;
var secret  = process.env.SESSION_SECRET;
var db_conn = process.env.DATABASE_URL;
// var ip_addr = process.env.NODE_IP_FOR_AUTH;

if (!secret)
  throw new Error('No session secret set.');
if (!db_conn)
  throw new Error('No db conn string set.');
// if (!ip_addr)
  // throw new Error('No ip auth set.');


app.configure(function () {

  // Settings:
  app.enable('trust proxy');
  app.set('view engine', 'blade');
  app.set('views', app_dir + '/Client');
  app.locals.pretty = true;

  // ================================================================
  // ================== Middleware ==================================
  // ================================================================

  // Close persistent client connections:
  app.use(function (req, resp, next) {
    if (shutting_down)
      resp.setHeader('Connection', 'close');
    next();
  });

  // Logging:
  if (IS_DEV)
    app.use(express.logger('dev'));

  // Too busy:
  app.use(function (req, resp, next) { // must go on top of other middleware
    if (toobusy()) {
      log('Too busy to send: ' + req.path);
      if (req.accepts('html')) {
        resp.send(503, "Website is busy right now. Try again later.");
      } else {
        resp.json(503, {success: false, msg: "Too busy", too_busy: true});
      }
    } else
      next();
  });

  // ===========================================
  // app.use(express.errorHandler());
  // ===========================================


  // ===========================================
  // === from:http://blog.liftsecurity.io/post/37388272578/writing-secure-express-js-apps 
  app.use(helmet.xframe());
  app.use(helmet.iexss());
  app.use(helmet.contentTypeOptions());
  app.use(helmet.cacheControl());
  // ===========================================

  // ===========================================
  // Static files:
  if (process.env.IS_HEROKU) {
    app.use(express.favicon(app_dir + '/Client/favicon.ico'));
    app.use('/', express.static(app_dir + '/Client' ));
  }
  // ===========================================

  // ===========================================
  // Parsing stuff (JSON, form data, etc):
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  // ===========================================

  // ===========================================
  // Session:
  app.use(express.cookieSession({
    secret   : secret,
    secure   : true,
    cookie   : {path: '/', httpOnly: true, secure: true},
    proxy    : true
  }));


  // ===========================================
  // Passport:
  // Must go after session middleware.
  app.use(passport.initialize());
  app.use(passport.session());
  // ===========================================

  // ==============================================================
  // Ensure logged in.
  // ==============================================================
  app.use(function (req, resp, next) {
    if (req.isAuthenticated())
      return next();

    if (req.method === 'GET' || req.method === 'HEAD')
      return next();

    if (exports.is_allow_unauth_path(req))
      return next();

    if (req.accepts('json')) {
      return resp.json({
        success: false,
        is_log_in_required: true,
        msg: RELOG_MSG
      });
    } else {
      return resp.send('<h1>Not logged in.</h1>');
    };
  })


  // ===========================================
  app.use(express.csrf());
  // ===========================================


  // Caching:
  app.use(function (req, resp, next) {
    if (req.accepts('html')) {
      resp.set("Expires", "Tue, 03 Jul 2001 06:00:00 GMT");
      resp.set("Last-Modified", "Wed, 15 Nov 1995 04:58:08 GMT");
      resp.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0");
      resp.set("Pragma", "no-cache");
    }
    next();
  });

  // Make sure user is not pretending to be someone else.
  app.use(function (req, resp, next) {
    if (req.user && req.body.hasOwnProperty('owner')) {
      req.body.as_this_life = req.body.owner;
      delete req.body.owner;
    }

    if (req.user && req.body.hasOwnProperty('as_this_life')) {

      var life = req.body.as_this_life;
      if (!req.user.is(life))
        return resp.json({success: false, msg: "Invalid screen name used: " + life, life: life});

      req.body.life_id      = req.user.screen_name_id(life);
      req.body.as_this_life = req.user.canonize_screen_name(life);

    } // === if

    next();
  });


  // ==============================================================
  // The routes.
  // ==============================================================
  app.use(app.router)

  // ==============================================================
  // Escape the data: =============================================
  // Set up default helpers, like New_Request: ====================
  // ==============================================================
  app.all('*', function (req, resp, next) {
    var f = F.new(F);
    req.F = f;

    f.on('not_found', function (f) {
      resp_404(req, resp, f.data.error.message);
    });

    f.on('invalid', function (f) {
      resp_invalid(req, resp, f.data.error.message);
    });

    _.each("params query body cookies".split(" "), function (k, i) {
      if (!req[k])
        throw new Error('Unknown key: ' + k);

      _.each(req[k], function (val, key) {
        if (!_.isString(key))
          return;
        if (key.indexOf('screen_name') > -1)
          req[k][key] = OMNI.canonize_screen_name(req[k][key]);
      });

      req[k] = e_e_e(req[k]);
    });

    resp.Ok = {
      if_not_found : function (msg) {
        return function (f) {
          if (!f.last || (_.isArray(f.last) && !f.last.length))
            return resp_404(req, resp, msg);
          f.finish(f.last);
        };
      },
      template_data : function (name, data) {
        if (!this._template_data) {
          var opts = this._template_data = {
            homepage_belongs_to_viewer: false,
            template_name : name,
            is_customer   : !!req.user,
            is_stranger   : !req.user,
            is_top_slash  : req.path === '/',
            IS_DEV        : IS_DEV,
            customer      : req.user,
            screen_name   : req.params.screen_name,
            is_owner      : false,
            token         : req.session._csrf,
            _csrf         : req.session._csrf,
            aud           : req.user,
            is_testing    : !!process.env.IS_TESTING,
            mtimes        : mtimes,
            add_mtime     : function (f) {
              if (mtimes[f])
                return f + '?' + mtimes[f];
              else
                return f;
            }
          };

          if (opts.is_customer) {
            opts.customer_screen_names = req.user.screen_names();
            opts.customer_has_one_life = opts.customer_screen_names.length === 1;
          }

          if (opts.is_customer && opts.screen_name)
            opts.is_owner = req.user.is(opts.screen_name);

        }
        if (data)
          _.extend(this._template_data, data);
        return this._template_data;
      },

      render_template: function (name, data) {
        if (name)
          this.template_data.apply(this, arguments);
        this.last_modified_now();
        return resp.render(this.template_data().template_name + '/markup', this.template_data());
      },
      last_modified_now : function () { resp.set('Last-Modified', (new Date).toUTCString()); },
      ETag_from : function (data) { resp.set('ETag', (new Date).getTime().toString()); },

      status : function (code) {
        if (code)
          this._status = code;
        return this._status || 200;
      },

      html:  function (str) {
        this.last_modified_now();
        this.ETag_from(str);
        resp.send(str);
      },

      text: function (str) {
        resp.set('Content-Type', 'text/plain');
        this.last_modified_now();
        this.ETag_from(str);
        return resp.send(str);
      },

      json: function (data, stat) {
        this.last_modified_now();
        this.ETag_from(data);
        if (stat)
          resp.status(stat);
        resp.json(data);
      },

      json_success: function (msg, o) {
        if (!o)
          o = {};
        o.msg     = msg;
        o.success = true;
        this.json(o);
      },

      json_fail: function (msg, o, stat) {
        if (!o)
          o = {};
        o.msg     = msg;
        o.success = false;
        this.json(o, (stat || 404));
      }

    };

    req.Ok = {
      run : function () {
        return f.run.apply(f, arguments);
      }
    };

    next();
  });

});



// ================================================================
// ================== Session Config: =============================
// ================================================================

passport.serializeUser(function (user, done) { done(null, user.data.id); });

passport.deserializeUser(function (id, done) {
  var on_err = function (err) {
  };

  River.new(null)
  .on_next('not_found', function (j) {
    done(null, false, {success: false, msg: "Not found."});
  })
  .job(function (j) {
    Customer.read_by_id(id, j);
  })
  .job(function (j, last) {
    done(null, last);
  })
  .run();
});

passport.use(new LocalStrategy( { usernameField: 'screen_name', passwordField: 'pass_phrase' }, function (screen_name, pass_phrase, done) {
  River.new(null)
  .on_next('not_found', function (j) {
    done(null, false, {success:false, message: "Not found."});
  })
  .job(function (j) {
    Customer.read_by_screen_name({screen_name: screen_name, pass_phrase: pass_phrase }, j);
  })
  .job(function (j, c) {
    done(null, c);
  })
  .run();
}));


function url_wanted(req, def) {
  if (!def)
    def = '/';
  var url = req.cookies && req.cookies.url_wanted;
  if (!url)
    return def;
  var pieces = url.split(':');
  var type = pieces[0];
  if (type === 'chat room of') {
    url = Screen_Name.to_url(pieces[1].trim(), 'chat');
    if (url)
      return url;
  }
  return def;
}

module.exports.sign_in = function (req, resp, next, msg) {
  return passport.authenticate('local', function(err, user, info) {
    if (err)
      return next(err);

    if (!user) {
      return resp.json( { msg: "Screen name or pass phrase was wrong. Check your spelling.", success: false } );
    }

    req.login(user, function(err) {
      if (err)
        return next(err);
      resp.json({
        msg         : msg || "Success: Please wait as page reloads...",
        success     : true,
        screen_name : Screen_Name.filter(req.body.screen_name),
        location    : url_wanted(req, Screen_Name.to_url(req.body.screen_name)),
        location    : '/'
      });
    });

  })(req, resp, next);
};

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

// _.each(['Site', 'Chat', 'Posts', 'Screen_Names'], function (name) {
  // require('./routes/' + name);
// });
// app.get('/', function (req, resp, next) {
  // // resp.render('index', {title: "somet", template_name: "index", is_customer: false});
  // resp.header("Last-Modified", "Thu, 16 Nov 1995 04:59:09 GMT");
  // resp.send(200, "huuuml");
// });

// if (process.env.IS_TESTING)
  // require('../Test/routes');


require('../Session/routes').route(module.exports);
require('./routes').route(module.exports);
require('../Customer/routes').route(module.exports);
require('../Screen_Name/routes').route(module.exports);
require('../Bot/routes').route(module.exports);
require('../Headline/routes').route(module.exports);





// ================================================================
// ================== ERRORS ======================================
// ================================================================

app.use(function (req, resp, next) {
  log('params: ', req.params)
  log('body: ', req.body)

  if (req.accepts('html')) {
    resp_404(req, resp, "Page Not found: " + req.path);
  } else {
    resp_404(req, resp, "Page Not found.");
  }
});



app.use(function (err, req, resp, next) {

  log(err, err.stack);

  var msg    = "Something broke. Try later.";
  var status = err.status || 500;

  if (status === 403)
    msg = RELOG_MSG;

  return resp_error(req, resp, msg, status);
});



// ====================================================
//                 The End
// ====================================================

var _is_read_able_ = /@is_read_able/ig;
Topogo.sql_proc(function (sql, vals) {
  if (vals.TABLES) {
    var orig = sql;
    sql = sql.replace(_is_read_able_, Topogo.where_readable(vals.TABLES));
    if (sql !== orig || (vals.hasOwnProperty('sn_ids') && !_.isArray(vals.sn_ids))) {
      vals.sn_ids = (vals.sn_ids) ? vals.sn_ids.screen_name_ids() : [0];
    }
  }
  return [sql, vals];
});

River.new()
.job(function (j) {
  Topogo.tables(j);
})
.job(function (j, tables) {

  server = app.listen(port, function () {
    log('Listening on: ' + port);
    j.finish();
  });

})
.run();

function screen_names(arr) {
  var names = {first: arr[0], list: arr, multi : (arr.length != 1) };
  return names;
};


exports.app    = app;

process.on('SIGHUP', function () {
  _.each(mtimes, function (v, k) {
    mtimes[k] = (new Date()).getTime();
  });
  console.log('SIGHUP: Reloading mtimes.');
});


var on_close = function () {
  server.close(function () {
    console.log("Closing toobusy, Topogo.");
    toobusy.shutdown()
    Topogo.close();
  });
};

process.on('SIGINT',  on_close);
process.on('SIGTERM', on_close);





