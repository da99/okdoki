
var _         = require('underscore')
, Customer    = require('../Customer/model').Customer
, blade       = require('blade')
, Faker       = require('Faker')
, Topogo      = require('topogo').Topogo
, River       = require('da_river').River
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

exports.route = function (mod) {
  var app = mod.app;

  app.get( '/' , function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    var opts = OK.template_data('Site/index')
    if (opts.logged_in) {
      opts['title'] = "Your OKdoki Homepage(s)";
    } else {
      opts['title'] = 'OkDoki.com';
    };

    return OK.render_template();
  });

}; // === end route func


// ==================================================================
//
//
// ==================================================================
function old_stuff() {
  _.each(['photo', 'video', 'text', 'link'], function (type) {
    OK.post("/folder/:num/attach_"+type, function (req, resp, next) {
      resp.json({success: true, msg: 'Created: ' + type, record: req.body});
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
} // end func: old stuff








