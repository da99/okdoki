var _         = require('underscore')
;


var express = require('express');
var toobusy = require('toobusy');
var app     = express();
var port    = process.env.PORT || 5555;

var app_dir = __dirname.split('/');
app_dir.pop();
app_dir = app_dir.join('/');



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

// Must go after session middleware.

app.configure(function () {
  app.set('view engine', 'jade');
  app.set('views', app_dir + '/views');
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

function write_plain(r, txt) {
  resp.writeHead(200, { "Content-Type": "text/plain" });
  resp.end(txt);
}

function write_html(resp, o, stat) {
  resp.writeHead((stat || 200), { "Content-Type": "text/html" });
  resp.end(o);
}



app.use(app.router)


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
// ****************** ERRORS **************************************
// ****************************************************************

app.use(function (req, resp, next) {
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

  console.log(err);

  if (req.body && req.body.request_type == 'latest msgs') {
    write_json( resp, { success: false, msg: err.toString() } );
    return true;
  };

  resp.send((err.status || 500), "Something broke. Try later.");
});



// =================================================================================
var server = app.listen(port, function () {
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
    aud          : req.user
  };

  if (opts.logged_in)
    opts.screen_names = req.user.screen_names();

  return opts;
}

exports.app    = app;
exports.port   = port;
exports.server = server;







