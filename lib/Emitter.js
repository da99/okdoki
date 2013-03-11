

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
  me.events[name] = [];
  return me;
};

E.prototype.on = function (name, f) {
  var me = this;
  me.validate_name(name, 'on');

  var events = me.events[name] || [];
  if (!events.length)
    events = me.events[name] = [];
  events.push( f );

  return me;
};

E.prototype.emit = function () {

  var me       = this;
  var args     = _.toArray(arguments);
  var name     = args.shift();
  var inv_name = 'invalid event name';

  if (name !== inv_name)
    me.validate_name(name, 'emit');

  var events = me.events[name];

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

E.prototype.validate_name = function (name, method_name) {
  var me = this;
  if( !me.events.hasOwnProperty(name) )
    return me.emit('invalid event name', 'method: ' + method_name + ', name: ' +  name);
  return true;
};













