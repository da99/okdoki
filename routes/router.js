var _ = require('underscore')
, fs  = require('fs')
, jade = require('jade')
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
      , html:  function (str) {
        this.last_modified_now();
        this.ETag_from(data);
        resp.send(str);
      }
      , text: function (data) {
        resp.set('Content-Type', 'text/plain');
        this.last_modified_now();
        this.ETag_from(data);
        return resp.send(data);
      }
      , json: function (data) {
        this.last_modified_now();
        this.ETag_from(data);
        resp.json(data);
      }
      , last_modified_now : function () {
        resp.set('Last-Modified', (new Date).toUTCString());
      }
      , ETag_from : function (data) {
        resp.set('ETag', (new Date).getTime().toString());
      }
      , template: function (data) {
        // app.set('view engine', 'jade');
        // app.set('views', app_dir + '/public/assets/applets');
        // return resp.render(data.template_name, data || {});
        //
        this.last_modified_now();
        var path = 'public/assets/applets' + '/' + data.template_name;
        var fn = jade.compile(jade_content(path);, {filename: path});
        return resp.send(fn(data || {}));
      }

    });
  });

  me.engine[method].apply(me.engine, engine_args);
  // me.engine[method](path, _.last(engine_args));

  return me;
};

var jade_cache = {};
function jade_content(path) {
  if(!jade_cache[path]) {
    var raw          = fs.readFileSync(path);
    jade_cache[path] = _.map(raw.split("\n"), function (line) {
      if (line.trim().indexOf('applet') === 0) {
        var name   = line.replace('applet', '').trim();
        var match  = line.match(/[^\s]/);
        var indent = (match) ?  line.substring(0, match.index) : "";
        return indent + "include " + name + "\n" + indent + '- applets.push("' + name + '")';
      }
    }).join("\n");
  }
console.log(jade_cache[path]);
  return jade_cache[path];
}







