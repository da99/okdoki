var _ = require('underscore');

var ok_router = exports.router = function (key) {
  return function (req, resp, next) {
    var routes = ok_router.routes[key];
    if (!routes || !routes.length)
      return next();
    _.find(routes, function (route) {
      return route(req, resp, next, {req: req, resp: resp, next: next});
    });
  };
};


ok_router.routes = {};
ok_router.push = function (key, func) {
  if (!ok_router.routes[key])
    ok_router.routes[key] = [];
  ok_router.routes[key].push(func);
  return ok_router;
};
