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

Job.prototype.stop = function (type, msg) {
  var me = this;

  me.river.stop();

  if (_.isArray(msg))
    msg = msg.join(' ');

  me[type + '_msg'] = msg;

  _.each((me.events[type] || []), function (e) {
    e(msg, me);
  });

  return this;
};

Job.prototype.not_found = function (msg) {
  this.stop('not_found', msg);
  return this;
};

Job.prototype.invalid = function (msg) {
  this.stop('invalid', msg);
  return this;
};

Job.prototype.error = function (msg) {
  this.stop('error', msg);
  this.river.error(this.error_msg, this);
  return this;
};

var River = exports.River = function (group, id) {
  this.job_list    = [];
  this.input_list  = [];
  this.waits       = [];
  this.events      = { finish: [] };
  this.results     = [];
  this.data        = {};
  this.uniq_job_id = 0;

  this.group = group || "no group name";
  this.id = id || ++River.uniq_id;
  if (arguments.length > 2) {
    throw new Error('Unknown arguments: ' + _.toArray(arguments).slice(2));
  }
}


River.uniq_id = 0;
River.valid_event_names = {
  'river': [
    'error',
    'finish'
  ],
  'job': [
    'not_found',
    'invalid',
    'error'
  ]};

var E_R   = River.valid_event_names['river'];
var E_JOB = River.valid_event_names['job'];

River.validate_event_name = function (list, r, name) {
  if (_.contains(list, name))
    return r;

  r.error("Invalid " + cat + " event name: " + name);
};

River.new = function (group, id) {
  var j = new River(group, id);
  return j;
};

River.prototype.validate_event_name = function (name) {
  River.validate_event_name(E_R, this, name);
  return this;
};

River.prototype.job = function () {

  var me     = this;
  var events = me.for_next_job || {};
  var group  = (_.isString(arguments[0]) && arguments[0]) || 'no group';
  var id     = (_.isNumber(arguments[1]) || _.isString(arguments[1])) ?
    arguments[1] :
    ++this.uniq_job_id;

  me.job_list.push(Job.new({
    group  : group,
    id     : id,
    func   : arguments[2] || arguments[0],
    river  : me,
    events : events
  }));

  return me;
};

River.prototype.on_job = function (name, func) {
  River.validate_event_name(E_JOB, this, name);
  var e = this.for_next_job;
  if (!e)
    e = this.for_next_job = {};
  if (!e[name])
    e[name] = [];
  e[name].push( func );

  return this;
};

River.prototype.on_error = function (f) {
  return this.on('error', f);
};

River.prototype.on_finish = function (f) {
  return this.on('finish', f);
};

River.prototype.on = function (name, f) {
  this.validate_event_name(name);

  var events = this.events[name];
  if (!events) {
    events = this.events[name] = [];
  }

  events.push(f);
  return this;
};

River.prototype.error = function (msg, job) {
  var err = null;
  if (_.isString(msg))
    err = new Error(msg);
  else if (msg && msg.error_msg)
    err = new Error(msg.error_msg);
  else
    err = msg;

  this.emit('error', err, job);
  return this;
};

River.prototype.emit = function (name, msg, job) {
  var error = 'error';

  if (!_.contains(E_R, name)) {
    msg = new Error('Invalid event name: ' + name);
    name = error;
  }

  var e = this.events[name] || [];
  var me = this, i = 0, l = e.length;

  if ( l === 0 && name === error ) {
    throw new Error('No error handlers defined: ' + msg);
  }


  if ( l === 0 )
    return null;

  while( i < l ) {
    e[i](msg, job);
    ++i;
  }

  return true;
};

River.prototype.stop = function () {
  this.is_stopped = true;
  return this;
};

River.prototype.last_reply = function () {
  return _.last(this.results)[0];
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







