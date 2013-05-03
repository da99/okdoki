
var _         = require('underscore')
, OK          = require('../App/router').OK
, Views       = require('../App/helpers/Views').Views
, blade       = require('blade')
, Faker       = require('Faker')
, Topogo      = require('topogo').Topogo
;

var MESS = {
};

function sample_im() {
  var id = (new Date).getTime();
  MESS[id] = {okid: 'm' + id, from_id: 0, from: 'OKDOKI.com',
    body: Faker.Name.firstName() + ' :: ' + Faker.Lorem.paragraph()
  };
  return MESS;
}

OK.get( '/' , function (i) {
  var req = i.req, resp = i.resp;
  var opts = Views.default_opts('Site/index', req, resp)
  if (opts.logged_in) {
    opts.template_name = opts.template_name + '-logged_in';
    opts['title'] = "Your OKdoki Homepage(s)";
  } else {
    opts['title'] = 'OkDoki.com';
  };

  return i.template(opts);
});

_.each(['/account', '/sign-in'], function (url) {
  OK.post(url, function (req, resp, next) {
    resp.json({success: true, screen_name: 'go99', display_name: 'Go99'});
  });
});

OK.get('/IMs', function (req, resp, next) {
  _.each(MESS, function (im, id) {
    if (id < ((new Date).getTime() - 3000)) {
      console.log('Deleting: ', id);
      delete MESS[id];
    }
  });
  sample_im();
  resp.json({success: true, ims: MESS});
});

OK.post('/IM', function (req, resp, next) {
  var id = (new Date()).getTime();
  MESS[id] = {body: req.body};
  resp.json({success: true});
});

OK.get('/keywords/:keywords', function (req, resp, next) {
  var opts                        = default_view_opts('keywords', req, resp);
  opts.title                      = req.param('keywords');
  opts.homepage_belongs_to_viewer = false;
  opts.keywords                   = req.param('keywords');
  opts.results                    = [ {href: '/info/go99/id/2', title: 'result 1', abstract: 'Summary'}, {href: '/info/go99/id/3', title: 'result 2', abstract: 'Summary 2'}];
  resp.render(opts['template_name'], opts);
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







