
var _         = require('underscore')
, OK          = require('okdoki/lib/routes/router').OK
, Views       = require('okdoki/lib/helpers/Views').Views
;


OK.get( '/' , function (i) {
  var req = i.req, resp = i.resp;
  var opts = Views.default_opts('index', req, resp)
  if (opts.logged_in) {
    opts['title'] = "Your OKdoki Homepage(s)";
  } else {
    opts['title'] = 'OkDoki.com';
  };

  resp.render(opts['view_name'], opts);
});


OK.get('/keywords/:keywords', function (req, resp, next) {
  var opts                        = default_view_opts('keywords', req, resp);
  opts.title                      = req.param('keywords');
  opts.homepage_belongs_to_viewer = false;
  opts.keywords                   = req.param('keywords');
  opts.results                    = [ {href: '/info/go99/id/2', title: 'result 1', abstract: 'Summary'}, {href: '/info/go99/id/3', title: 'result 2', abstract: 'Summary 2'}];
  resp.render(opts['view_name'], opts);
});


// ****************************************************************
// ****************** Authentication ******************************
// ****************************************************************

OK.get('/log-out', function (req, resp, next) {
  req.logout();
  resp.redirect('/');
});

OK.post('/sign-in', function (req, resp, next) {

  if (!req.body.screen_name || req.body.screen_name.trim().length == 0 )
    return write.json( resp, { msg: "Screen name is required.", success: false } );

  if (!req.body.pass_phrase || req.body.pass_phrase.trim().length == 0 )
    return write.json( resp, { msg: "Password is required.", success: false } );

  passport.authenticate('local', function(err, user, info) {

    if (err)
      return next(err);

    if (!user) {
      return write.json( resp, { msg: "Screen name/pass phrase was wrong. Check your spelling.", success: false } );
    }

    req.login(user, function(err) {
      if (err)
        return next(err);
      write.json( resp, { msg: "You are now sign-ed in. Please wait as page reloads...", success: true } );
    });

  })(req, resp, next);

  return false;
});







