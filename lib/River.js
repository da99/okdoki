var _ = require('underscore')
;

var Job = function (vals) {
  var me = this;
  _.each(vals, function (v, k) {
    if (k === 'func' && !_.isFunction(v)) {
      me[k] = function (j) {
        var args = _.toArray(v);
        var o = args.shift();
        var m = args.shift();
        args.push(j);
        return o[m].apply( o, args );
      }
    } else {
      me[k] = v;
    }
  });
};

Job.new = function (vals) {
  var j = new Job(vals);
  return j;
};

Job.prototype.finish = function () {
  var args = _.toArray(arguments);
  var me   = this;
  args.unshift(me);
  me.river.finish.apply(me.river, args);
  return this;
};

Job.prototype.invalid = function (msg) {

  var me = this;

  me.river.stop();

  if (_.isArray(msg))
    msg = msg.join(' ');

  me.invalid_msg = msg;

  _.each((me.events['invalid'] || []), function (e) {
    e(me);
  });

  return this;
};


var River = exports.River = function (group, id) {
  this.job_list   = [];
  this.input_list = [];
  this.waits      = [];
  this.events     = { finish: [] };
  this.results    = [];
  this.data       = {};

  this.group = group || "no group name";
  this.id = id || ++River.uniq_id;
  if (arguments.length > 2) {
    throw new Error('Unknown arguments: ' + _.toArray(arguments).slice(2));
  }
}

River.uniq_id = 0;
River.valid_event_names = [
  'not_found',
  'invalid',
  'error',
  'finish'
];

River.validate_event_name = function (r, name) {
  if (_.contains(River.valid_event_names, name))
    return r;
  r.error("Invalid event name: " + name);
};

River.new = function (group, id) {
  var j = new River(group, id);
  return j;
};

River.prototype.job = function () {

  var me = this;
  var events = me.for_next_job || {};

  me.job_list.push(Job.new({
    group  : arguments[0],
    id     : arguments[1],
    func   : arguments[2],
    river  : me,
    events : events
  }));

  return me;
};

River.prototype.on_job = function (name, func) {
  River.validate_event_name(this, name);
  var e = this.for_next_job;
  if (!e)
    e = this.for_next_job = {};
  if (!e[name])
    e[name] = [];
  e[name].push( func );

  return this;
};

River.prototype.on = function (name, f) {
  switch (name) {
    case 'finish':
      break;
    default:
      this.error(new Error('Unknown event:' + name));
  };
  var events = this.events[name];
  if (!events) {
    events = this.events[name] = [];
  }

  events.push(f);
  return this;
};

River.prototype.emit = function (name) {
  var e = this.events[name] || [];
  var me = this, i = 0, l = e.length;

  if ( l === 0 )
    return null;

  while( i < l ) {
    e[i](me);
    ++i;
  }

  return true;
};

River.prototype.stop = function () {
  this.is_stopped = true;
  return this;
};

River.prototype.finish = function () {

  if (this.is_stopped)
    return this;

  if (this.is_finish) {
    this.error(new Error('Job already finished: ' +
                         this.group + ':' + this.id));
  }

  var job    = arguments[0];
  var replys = _.toArray(arguments).slice(1);

  this.waits.shift();

  if (this.results) {
    this.results.push(replys);
  }

  if (this.after_each_finish) {
    this.emit('job finish');
  }

  if (this.waits.length < 1) {
    this.is_finish = true;
    this.emit('finish');
  } else {
    ++this.current_job_i;
    this.run_job(this.current_job_i);
  }

  return this;
};

River.prototype.run_job = function (i) {
  var me = this;
  var current_job = this.job_list[i];

  current_job.func(current_job);
};

River.prototype.run = function () {
  var target, method_name;
  var l              = this.job_list.length;
  var i              = 0;
  var me             = this;
  this.current_job_i = 0;

  if ( l === 0 ) {
  } else {
    while (i < l) {
      this.waits.push(i);
      ++i;
    }

    me.run_job(this.current_job_i);
  }

  return this;
};

River.prototype.for_each_finish = function (f) {
  this.after_each_finish = f;
  return this;
};

River.prototype.run_and_on_finish = function (f) {
  this.on('finish', f);
  this.run();
  return this;
};







