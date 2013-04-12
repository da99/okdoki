
var _         = require('underscore')
, ok_router   = require('okdoki/lib/routes/router').router
, Views       = require('okdoki/lib/helpers/Views').Views
;


ok_router.push( 'get /' , function (req, resp) {
    var opts = Views.default_opts('index', req, resp)
    if (opts.logged_in) {
      opts['title'] = "Your OKdoki Homepage(s)";
    } else {
      opts['title'] = 'OkDoki.com';
    };

    resp.render(opts['view_name'], opts);
  }
);
