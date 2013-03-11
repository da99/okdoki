

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
    };

  if (_.contains(meths, 'emit'))
    v.emit = function () {
      var args = _.toArray(arguments);
      args.unshift(args[0]);
      me.emit.apply(me, args);
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

E.prototype.on = function (raw_name, f) {
  var me   = this;
  var pair = me.validate_name(raw_name, 'on');
  if (!pair)
    return null;
  var key  = pair.shift();
  var name = pair.shift();

  var events = me.events[name];
  if (!events)
    events = me.events[name] = {before: [], middle: [], after: []};
  events[key].push( f );

  return me;
};

E.prototype.emit = function () {

  var me       = this;
  var args     = _.toArray(arguments);
  var name     = args.shift();
  var inv_name = 'invalid event name';
  var key      = null;

  if (name !== inv_name)
    key = me.validate_name(name, 'emit');

  var events = me.events_for(name);

  if (!events.length && name === inv_name)
    throw new Error("Invalid event name: " + args.toString());
  else {
    args.unshift(name);
    _.each(events, function (func) {
      func.apply(null, args);
    });
  }

  return me;
};

E.prototype.events_for = function (name) {
  var me = this;
  var events = me.events[name];
  if (!events)
    return [];
  return events['before'].concat(events['middle']).concat(events['after']);
};

E.prototype.validate_name = function (name, method_name) {
  var me    = this;
  var pos   = ['before', 'middle', 'after'];
  var pos_l = pos.length;
  var key   = 'middle';

  while (--pos_l > -1) {
    if (name.indexOf(pos[pos_l] + ' ') === 0) {
      key = pos[pos_l];
      name = name.replace(key + ' ', '');
      pos_l = -1;
    }
  }

  if( !me.events.hasOwnProperty(name) ) {
    me.emit('invalid event name', 'method: ' + method_name + ', name: ' +  name);
    return null;
  }

  return [key, name];
};













