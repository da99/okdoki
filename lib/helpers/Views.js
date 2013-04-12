
var V = exports.Views = {};

V.default_opts = function default_view_opts(name, req, resp) {
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
