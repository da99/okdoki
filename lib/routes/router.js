var _ = require('underscore');

var App = exports.App = function () { }

App.new = function (app) {
  var o = new App;
  o.routes = {};
  if (app)
    o.engine(app);
  return o;
};

App.prototype.engine = function (app) {
  if (arguments.length)
    this.engine = app;
  return this.engine;
};

App.prototype.route = function (method, path, func) {

  var me  = this;
  var key = method + " " + path;

  if (func) {
    me.routes[key] = func;
    return me;
  }

  func = me.routes[key];
  if (!func)
    throw new Error("Route has not been defined: " + key);

  me.engine[method](path, function (req, resp, next) {
    var i = (func.length === 1) ? {
      req  : req,
      resp : resp,
      next : next,
      app  : me
    } : [req, resp, next];

    func(i);
  });

  return me;

};


_.each(['get', 'head', 'post', 'put', 'delete'], function (name) {
  App.prototype[name] = function (path, func) {
    var args = [name].concat(_.toArray(arguments));
    this.route.apply(this, args);
  };
});


var ok = exports.OK = App.new();






