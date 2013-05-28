
var V = exports.Views = {};

V.default_opts = function default_view_opts(name, req, resp) {
  var opts = { homepage_belongs_to_viewer: false,
    template_name : name,
    logged_in     : !!req.user,
    customer      : req.user,
    screen_name   : req.params.screen_name,
    screen_names  : [],
    token         : req.session._csrf,
    _csrf         : req.session._csrf,
    aud           : req.user,
    is_testing    : !!process.env.IS_TESTING
  };

  if (opts.logged_in)
    opts.screen_names = req.user.screen_names();

  if (!opts.screen_name)
    opts.screen_name = opts.screen_names[0]

  return opts;
}
