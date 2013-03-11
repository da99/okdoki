var _ = require('underscore')
Emitter = require('okdoki/lib/Emitter').Emitter
;

var ALL_SPACES = / /g;

// ****************************************************************
// ****************** Job *****************************************
// ****************************************************************


var Job = function () {};

Job.new = function (vals) {
  var error_names = ['not found', 'invalid', 'error'];
  var j      = new Job();
  var me     = j;
  me.is_job  = true;
  me.emitter = Emitter.new( 'invalid', 'not found', 'error', me );

  me.finishs = [function () {
    var args = _.toArray(arguments);
    args.unshift(me);
    me.river.finish.apply(me.river, args);
    return me;
  }];

  // save propertys to job: eg group, id, etc.
  _.each(vals, function (v, k) {
    if (k === 'func' && !_.isFunction(v)) {
      me[k] = function (j) {
        var args = _.toArray(v);
        var obj  = args.shift();
        var meth = args.shift();
        args.push(j);
        return obj[meth].apply( obj, args );
      }
    } else {
      me[k] = v;
    }
  });

  me.finish = function () {
    if (me.is_stopped())
      return me;
    me.finishs.pop().apply(me, arguments);
    return me;
  };

  _.each(error_names, function (type) {
    me[type.replace(ALL_SPACES, '_')] = function () {
      var args = _.toArray(arguments);
      args.unshift(type);
      args.push(me);
      me.emit.apply(me, args);
    };

    me.on('before', type, function (msg) {
      me.about_error = {
        msg  : msg,
        type : type
      };

      if (me.is_stopped())
        return me;

      me.stop();

      return me;
    });

    me.on('after', type, function (msg) {
      if (_.isArray(msg))
        msg = msg.join(' ');
      me.river.error(msg, me);
      return null;
    });
  });

  me.is_stopped = function () {
    return me.is_stop || (me.origin() && me.origin().is_stopped());
  };

  me.stop = function () {
    me.is_stop = true;
    me.river.stop();
    return me;
  };

  return j;
};

Job.prototype.origin = function () {
  return this.river.origin();
};

Job.prototype.concat = function (fin) {
  var me = this;
  me.finishs.push(fin);
  return me;
};



// ****************************************************************
// ****************** River ***************************************
// ****************************************************************


var River     = exports.River = function () {};
River.uniq_id = 0;

River.new = function () {

  var me = new River();
  me.continue_on_not_found = null;
  me.job_list     = [];
  me.input_list   = [];
  me.waits        = [];
  me.finishs      = [];
  me.replys       = [];
  me.named_replys = {};
  me.data         = {};
  me.uniq_job_id  = 0;
  me.is_river     = true;
  me.emitter      = Emitter.new(
    'error',
    'finish',
    'job',
    me
  );

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

  me.on('after', 'error', function () {
    if (me.origin())
      return me.origin().error.apply(me.origin(), arguments);
  });

  return me;
};

River.prototype.origin = function () {
  var p = this.parent_job;
  if (p) {
    return p.origin() || p;
  }
  return null;
};

River.prototype.set = function (name, val) {
  this.data[name] = val;
  return this;
};

River.prototype.get = function (name, defut) {
  if (this.data.hasOwnProperty(name))
    return this.data[name];
  return defut;
};

River.prototype.is_stopped = function () {
  return this.is_stop || !this.waits.length || (this.origin() && this.origin().is_stopped());
};

River.prototype.stop = function () {
  this.is_stop = true;
  if (this.origin())
    this.origin().stop();
  return this;
};

River.prototype.on_job = function () {

  var e = this.for_next_job;
  if (!e)
    e = this.for_next_job = [];

  e.push(arguments);

  return this;

};

River.prototype.job = function () {

  var me     = this;
  var args   = _.toArray(arguments);
  var args_l = args.length;
  var job    = null;

  switch (args_l) {
    case 2:
      var func  = args.pop();
      var group = args.pop();
      var id    = args.pop();
      break;
    default:
      var func  = args.pop();
      var id    = args.pop();
      var group = args.pop();
  };

  if (group === undefined)
    group = 'no group';
  if (id === undefined)
    id = ++this.uniq_job_id;

  job = Job.new({
    group     : group,
    id        : id,
    func      : func,
    river     : me,
  });

  me.job_list.push(job);

  _.each((me.for_next_job || []), function (args) {
      job.on.apply(job, args);
  });

  me.for_next_job = [];
  return me;
};

River.prototype.error = function (err_or_msg, job) {

  var err  = null;

  if (_.isString(err_or_msg))
    err = new Error(err_or_msg);
  else
    err = err_or_msg;

  var job_had_no_events = (!job || !job.about_error || (job.emitter.events_for(job.about_error.type, 'middle').length === 0));
  if (!this.origin() && !this.emitter.events_for('error', 'middle').length) {
    if (job_had_no_events)
      throw (err || new Error('Unknown error.'));
  }

  if (job_had_no_events)
    this.emit('error', err, job);

  return this;
};

River.prototype.reply_counter = -1;
River.prototype.reply = function () {
  var me = this;

  var group = 'save reply', id = ++me.reply_counter, func;
  _.each(arguments, function (v) {
    if (_.isString(v)) {
      if (group)
        id = v;
      else
        group = v;
    } else {
      func = v;
    }
  });

  me.job(group, id, function (j) {
    j.finish(func(j.river.last_reply(), me));
  });

  return me;
};

River.prototype.reply_for = function (group, id) {
  var me = this;
  var reply = me.reply_s_for(group, id);
  return reply[0];
};

River.prototype.replys_for = function (group, id) {
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
  return ( _.last(this.replys) || [] )[0];
};

River.prototype.finish = function () {

  var job    = arguments[0];
  var replys = arguments[1];

  if (this.waits.length < 0) {
    this.error('River already finished', job);
    return false;
  }

  this.replys.push(replys);
  this.named_replys[job.group + ':' + job.id] = replys;
  this.emit('after', 'job', job);

  if (this.waits.length < 1) {
    this.emit('finish', this);
  } else {
    this.run_job();
  }

  return this;
};

River.prototype.verbose = function () {
  this.on('before', 'job', function (j) {
    console['log'](j.group, j.id);
  });
  return this;
};

River.prototype.run_job = function () {
  if (this.is_stopped())
    return this;
  var me          = this;
  var current_job = me.job_list[me.waits.shift()];

  me.emit('before', 'job', current_job);
  if (current_job.func.length === 2)
    current_job.func(current_job, me.last_reply());
  else
    current_job.func(current_job);
  // Very little is reached below this line...
  // because:
  //   run_job
  //    finish
  //      run_job
  //        finish
};

River.prototype.run = function (f) {
  if (this.is_running)
    return this.error('Already running.');
  this.is_running = true;

  if (f)
    this.on('finish', f);

  var me     = this;
  this.waits = _.map(this.job_list, function (j, i) {
    return i;
  });

  if ( !this.waits.length ) {
    return this;
  }

  me.run_job();
};







