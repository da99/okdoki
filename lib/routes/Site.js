
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
}
);
