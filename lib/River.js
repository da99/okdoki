var _ = require('underscore')
;

var Job = function (vals) {
  var me = this;
  this.is_job = true;

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

  me.finish = function () {
    var args = _.toArray(arguments);
    args.unshift(me);
    me.river.finish.apply(me.river, args);
    return this;
  };

  me.not_found = function (msg) {
    me.stop('not_found', msg);
    return me;
  };

  me.invalid = function (msg) {
    me.stop('invalid', msg);
    return me;
  };

  me.error = function (msg) {
    me.stop('error', msg);
    return me;
  };

};

Job.new = function (vals) {
  var j = new Job(vals);
  return j;
};

Job.prototype.stop = function (type, msg) {
  var me            = this;
  me[type + '_msg'] = msg;

  if (type === 'not_found' && me.continue_on_not_found) {
    var arr   = me.continue_on_not_found;
    var f     = arr.pop();
    var id    = arr.pop();
    var group = arr.pop();
    me.continue_on_not_found = null;
    var j = Job.new({
      group  : group,
      id     : id,
      func   : f,
      river  : me.river,
      events : me.events
    });
    j.func(j);
    return me;
  }

  var funcs = me.events[type] || [];
  me.river.stop();

  if (!funcs.length && type !== 'error') {
    if (!this.river.parent_job)
      throw new Error(msg);
  }

  if (_.isArray(msg))
    msg = msg.join(' ');

  _.each(funcs, function (e) {
    e(msg, me);
  });

  if (type === 'error' || this.river.parent_job)
    return this.river.emit(type, msg, me);

  return this;
};

var River = exports.River = function () {};
River.uniq_id = 0;
River.valid_event_names = {
  'river': [
    'error',
    'finish',
    'job finish'
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

River.new = function () {

  var me = new River();
  me.continue_on_not_found = null;
  me.job_list     = [];
  me.input_list   = [];
  me.waits        = [];
  me.events       = { finish: [] };
  me.replys       = [];
  me.named_replys ={};
  me.data         = {};
  me.uniq_job_id  = 0;
  me.is_river     = true;

  var args = _.toArray(arguments);
  while(args.length) {
    var temp = args.shift();
    if (_.isString(temp)) {
      if (!me.group)
        me.group = temp;
      else if (!me.id)
        me.id = temp;
    } else if (temp && temp.length) {
      me.parent_job = _.find(temp, function (v) {
        return v && v.is_job;
      });
    } else  if (_.isNull(temp) && !me.parent_job)
      me.parent_job = temp;
    else if (temp && temp.is_job)
      me.parent_job = temp;
    else
      me.error('Unknown argument: ' + temp);
  }

  if (!me.group)
    me.group = "no group name";

  if (me.id === undefined || me.id === null)
    me.id = ++River.uniq_id;

  return me;
};

River.prototype.validate_event_name = function (name) {
  River.validate_event_name(E_R, this, name);
  return this;
};

River.prototype.job = function () {

  var me     = this;
  var events = me.for_next_job || {};
  var args   = _.toArray(arguments);
  var func   = args.pop();
  var id     = args.pop();
  var group  = args.pop();
  var job    = null;

  if (group === undefined)
    group = 'no group';
  if (id === undefined)
    id = ++this.uniq_job_id;

  me.job_list.push(job = Job.new({
    group     : group,
    id        : id,
    func      : func,
    river     : me,
    events    : events,
    continue_on_not_found : me.continue_on_not_found
  }));

  me.continue_on_not_found = null;

  return me;
};

River.prototype.continue_on_job = function (name, job_name, job_id, func) {
  if (name !== 'not_found')
    return this.error('River can\'t handle continues for: ' + name);

  if (this.continue_on_not_found)
    return this.error('Already defined: continue_on_job ' + name);

  var args = _.toArray(arguments);
  if (_.isFunction(job_id)) {
    func   = job_id;
    job_id = ++this.uniq_job_id;
  }

  this.continue_on_not_found = [name, job_name, job_id, func];

  return this;
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

River.prototype.emit = function (name, msg, job_or_me) {
  var error = 'error';

  if(_.contains(E_JOB, name) && this.parent_job) {
    var result = this.parent_job[name](msg);
    if (name !== error)
      return result;
  }

  if (!_.contains(E_R, name)) {
    msg = new Error('Invalid event name: ' + name);
    name = error;
  }

  var e = this.events[name] || [];
  var me = this, i = 0, l = e.length;

  if ( l === 0 && name === error && !this.parent_job) {
    if (_.isString(msg))
      throw new Error(msg);
    else
      throw msg;
  }

  while( i < l ) {
    if (msg)
      e[i](msg, job_or_me);
    else
      e[i](job_or_me);
    ++i;
  }

  if ( me.parent_job  && me.parent_job[name] ) {
    if (name === 'finish' && !e.length)
      return me.parent_job[name](msg || me.last_reply(), job_or_me);
  }

  return true;
};

River.prototype.stop = function () {
  this.is_stopped = true;
  return this;
};

River.prototype.reply_for = function (group, id) {
  var me = this;
  var reply = me.reply_s_for(group, id);
  return reply[0];
};

River.prototype.reply_s_for = function (group, id) {
  var me = this;
  var replys = [];
  var use_both = _.compact([group, id]).length === 2;
  _.find(me.named_replys, function (arr, name) {
    if (use_both) {
      if (name === group+':'+id) {
        replys = arr;
        return true;
      }
    } else {
      if (name.index_of(group+':') > -1)
        replys.push(arr);
    }
    return false;
  });

  return replys;
};

River.prototype.first_reply = function () {
  return _.first(this.replys)[0];
};

River.prototype.last_reply = function () {
  return _.last(this.replys)[0];
};

River.prototype.finish = function () {
  if (this.is_stopped || (this.parent_job && this.parent_job.river.is_finish))
    return this;

  if (this.is_finish) {
    this.error(new Error('Job already finished: ' +
                         this.group + ': ' + this.id));
  }

  var job    = arguments[0];
  var replys = _.toArray(arguments).slice(1);
  this.waits.shift();

  this.replys.push(replys);
  this.named_replys[job.group + ':' + job.id] = replys;

  this.emit('job finish', job);

  if (this.waits.length < 1) {
    this.is_finish = true;
    this.emit('finish', null, this);
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

River.prototype.run = function (f) {
  if (f)
    return this.run_and_on_finish(f);

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
  this.on('job finish', f);
  return this;
};

River.prototype.run_and_on_finish = function (f) {
  this.on('finish', f);
  this.run();
  return this;
};







