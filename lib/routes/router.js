var _ = require('underscore')
, fs  = require('fs')
, Plates = require('plates')
;

var App = exports.App = function () { }

App.new = function (app) {
  var o = new App;
  o.routes = {};
  o.templates = {};
  if (app)
    o.engine(app);
  return o;
};

var ok = exports.OK = App.new();

App.prototype.engine = function (app) {
  if (arguments.length)
    this.engine = app;
  return this.engine;
};

_.each(['get', 'head', 'post', 'put', 'delete'], function (name) {
  App.prototype[name] = function (path, func) {
    var args = [name].concat(_.toArray(arguments));
    this.route.apply(this, args);
  };
});

App.prototype.template = function (file_name) {
  this.next_ext = { ext: 'html', file_name: file_name };
  this.templates[file_name + '.' + this.next_ext.ext] = null;
  return this;
};

App.prototype.json = function () {
  this.next_ext = { ext: 'json' };
  return this;
};

App.prototype.text = function () {
  this.next_ext = { ext: 'text' };
  return this;
};

App.prototype.listen = function () {
  return this.engine.listen.apply(this.engine, arguments);
};


App.prototype.route = function (method, path, other_args) {

  var me         = this;
  var key        = method + " " + path;
  var middleware =  _.toArray(arguments).slice(2);
  var func       = middleware.pop();
  var ext        = this.next_ext || {ext: 'html'};
  this.next_ext  = null;

  me.routes[key] = _.toArray(arguments);

  var engine_args = [path].concat(middleware);
  engine_args.push(function (req, resp, next) {
    if (func.length !== 1)
      return func(req, resp, next);

    return func({
      req  : req,
      resp : resp,
      next : next,
      app  : me,
      status : function (code) {
        if (code)
          this._status = code;
        return this._status || 200;
      }
      , text: function (data) {
        res.set('Content-Type', 'text/plain');
        return resp.send(status, data);
      }
      , json: function (data) {
        resp.json(data);
      }
      , html: function (data) {
        if (!ext.file_name)
          return resp.send(data);
        return resp.render(ext.file_name, data || {});
      }

    });
  });

  me.engine[method].apply(me.engine, engine_args);
  // me.engine[method](path, _.last(engine_args));

  return me;
};








