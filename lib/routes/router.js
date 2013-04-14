var _ = require('underscore')
, fs  = require('fs')
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

App.prototype.html = function (file_name) {
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

App.prototype.status = function (code) {
  if (code)
    this._status = code;
  return this._status || 200;
};

App.prototype.start = function () {
  var me = this;
  var args = _.toArray(arguments);
  var files = _.keys(me.templates);
  _.each(me.templates, function (v, name) {
    fs.readFile('templates/' + name, function (err, content) {
      if (err) throw err;
      me.templates[name] = '' + content;
      files.pop();
      if (!files.length)
        me.engine.listen.apply(me.engine, args);
    });
  });
};

App.prototype.route = function (method, path, other_args) {

  var me         = this;
  var key        = method + " " + path;
  var middleware =  _.toArray(arguments).slice(2);
  var func       = middleware.pop();
  var ext        = this.next_ext || {};
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
      app  : me
      , finish: function (content) {
        if (ext.ext === 'html' || !ext.ext) {
          resp.writeHead((this.status()), { "Content-Type": "text/html" });
          resp.end(content || "Not ready to use templates.");
        }
        if (ext.ext === 'text') {
          resp.writeHead((this.status()), { "Content-Type": "text/plain" });
          resp.end(content);
        }
        if (ext.ext === 'json') {
          resp.writeHead(this.status(), { "Content-Type": "application/json" });
          resp.end(JSON.stringify(content));
        }
      }
    });
  });

  me.engine[method].apply(me.engine, engine_args);

  return me;
};








