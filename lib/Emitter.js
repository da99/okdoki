

var _ = require('underscore')
;


var E = exports.Emitter = function () { };

E.new = function () {
  var me           = new E;
  me.events        = {};
  me.valid_names   = [];
  me.add_valid_event_name('invalid event name');

  _.each(_.flatten(_.toArray(arguments)), function (v) {
    if (_.isString(v))
      me.add_valid_event_name(v);
    else
      me.delegate(v);
  });

  return me;
};


E.prototype.delegate = function (v) {
  var me = this;
  var meths = ['on', 'emit'];
  if (arguments.length > 1) {
    meths = _.flatten(_.toArray(arguments).slice(1));
  }

  if (_.contains(meths, 'on'))
    v.on = function () {
      me.on.apply(me, arguments);
      return v;
    };

  if (_.contains(meths, 'emit'))
    v.emit = function () {
      me.emit.apply(me, arguments);
      return v;
    };

  return me;
};

E.prototype.add_valid_event_name = function (name) {
  var me = this;
  if (me.events.hasOwnProperty(name))
    return me;
  me.events[name] = {'before': [], 'middle': [], 'after': []};
  return me;
};

E.prototype.on = function (key, name, f) {
  var me     = this;
  var triple = me.validate_name(key, name, f);
  if (!triple)
    return false;
  key        = triple[0];
  name       = triple[1];
  f          = triple[2];

  var events = me.events[name];
  if (!events)
    events = me.events[name] = {before: [], middle: [], after: []};
  events[key].push( f );

  return me;
};

E.prototype.emit = function () {
  var me       = this;
  var args     = _.toArray(arguments);
  var run_all  = !_.contains(['before', 'middle', 'after'], args[0]);
  var inv_name = 'invalid event name';

  if (args[0] === inv_name || args[1] === inv_name)  {
    var key      = (run_all) ? 'middle' : args[0];
    var name     = (run_all) ? args[0]  : args[1];
  } else {
    var triple   = me.validate_name(args[0], args[1], null);
    if (!triple)
      return false;
    var key      = triple[0];
    var name     = triple[1];
  }

  var run = {
    stop    : function () { this.is_stopped = true; return me; },
    emitter : me,
    name    : name
  };

  var events = (run_all) ? me.events_for(name) : me.events_for(name, key);

  if (!events.length && name === inv_name) {
    throw new Error(args.join(': '));
  } else {
    if (run_all) {
      args.shift();
    } else {
      args.shift();
      args.shift();
    }
    _.find(events, function (func) {
      func.apply(run, args);
      return run.is_stopped;
    });
  }

  return me;
};

E.prototype.events_for = function (name, key) {
  var me = this;
  var events = me.events[name];

  if (!events)
    return [];

  if (key)
    return events[key];

  return events['before'].concat(events['middle']).concat(events['after']);
};

E.prototype.validate_name = function (key, name, method_name) {
  var me    = this;
  var pos   = ['before', 'middle', 'after'];
  var default_pos = false;

  if (!_.contains(pos, key)) {
    var real_name = key;
    default_pos   = true;
    method_name   = name;
    name          = key;
    key           = 'middle';
  }

  if (!me.events.hasOwnProperty(name)) {
    if (default_pos)
      me.emit('invalid event name', 'name: ' +  name);
    else
      me.emit('invalid event name', 'position: ' + key + ', name: ' +  name);
    return null;
  }

  return [key, name, method_name];
};













