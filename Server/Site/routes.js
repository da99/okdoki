
var _         = require('underscore')
, OK          = require('../App/router').OK
, Views       = require('../App/helpers/Views').Views
, Customer    = require('../Customer/model').Customer
, blade       = require('blade')
, Faker       = require('Faker')
, Topogo      = require('topogo').Topogo
, River       = require('da_river').River
;

var MESS = {
};

var New_River = function (req, resp, next) {
  var r = River.new(null);
  r.next('invalid', function (j) {
    resp.json({success: false, msg: j.job.error.message});
  });
  return r;
};

function sample_im() {
  var id = (new Date).getTime();
  MESS[id] = {okid: 'm' + id, from_id: 0, from: 'OKDOKI.com',
    body: Faker.Name.firstName() + ' :: ' + Faker.Lorem.paragraph()
  };
  return MESS;
}

OK.get('/me/:name', function (i) {
  var req = i.req, resp = i.resp;
  var opts = Views.default_opts('Screen_Names/me', req, resp)
  opts['title'] = i.req.params.name;
  opts['name'] = req.params.name;
  return i.template(opts);
});

OK.post('/me/:name/create/folder', function (req, resp, next) {
  var num = parseInt(Math.random() * 10)
  resp.json({success: true, location: "/me/" + req.params.name + "/folder/" + num, name: req.body.title});
});

OK.get('/me/:screen_name/folder/:num', function (i) {
  var req           = i.req, resp = i.resp;
  var num           = parseInt(req.params.num);
  var opts          = Views.default_opts('Folders/show_one', req, resp)
  opts['title']     = "Folder #" + num;
  opts['name']      = req.params.num;
  opts['about']     = "Stuff about #" + num;
  opts['folder_id'] = num;
  return i.template(opts);
});

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

OK.get("/me/:screen_name/folder/:num/page/:page_num", function (i) {
  var req           = i.req, resp = i.resp;
  var num           = parseInt(req.params.num);
  var page_num      = parseInt(req.params.page_num);
  var opts          = Views.default_opts('Folders/page', req, resp)
  opts['title']     = "Page #" + page_num;
  opts['about']     = "Stuff about Page #" + page_num;
  opts['page_num']  = page_num;
  opts['folder_id'] = num;
  opts['items']     = _.map("Item 0,Item 1,Item 2 dsdf sfsdf sdfdsdf sfsdf sdfdsdf sfsdf sdf  dsdf sfsdf sdfdsdf sfsdf sdf dsdf sfsdf sdf dsdf sfsdf sdf dsdf sfsdf sdf dsdf sfsdf sdf dsdf sfsdf sdf   ,Item 3".split(','), function (v, i) {
    if (i == 2)
      return ['Title 3', v];
    return [null, v];
  });
  return i.template(opts);
});

OK.post("/me/:screen_name/folder/:num/create/page", function (req, resp, next) {
  var o      = _.clone(req.body);
  var num    = parseInt(Math.random() * 10)
  o.location = "/me/" + req.params.screen_name + "/folder/" + req.params.num + '/page/' + num;
  o.created_at = (new Date).getTime();
  resp.json({success: true, msg: 'Created: ' + req.body.title, record: o});
});

OK.post('/me/:screen_name/folder/:num/page/:page_num/create/text', function (req, resp, next) {
  var o = _.clone(req.body);
  if (!o.title.trim().length)
    o.title = null;
  resp.json({success: true, msg: 'Created: new text', record: [o.title, o.body]});
});

_.each(['photo', 'video', 'text', 'link'], function (type) {
  OK.post("/folder/:num/attach_"+type, function (req, resp, next) {
    resp.json({success: true, msg: 'Created: ' + type, record: req.body});
  });
});

OK.post('/account', function (req, resp, next) {
  var r = New_River(req, resp, next);
  r.job(function (j) {
    console.log(req.body)
    Customer.create({
      screen_name         : req.body.screen_name,
      display_name        : req.body.screen_name,
      ip                  : req.ip,
      pass_phrase         : req.body.pass_phrase,
      confirm_pass_phrase : req.body.confirm_pass_phrase
    }, j);
  })
  .run(function (r, last) {
    var sn = last.screen_names()[0];
    resp.json({success: true, screen_name: sn, location: '/me/' + sn});
  });
});

_.each(['/sign-in'], function (url) {
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







