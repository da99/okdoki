var _ = require('underscore')
Emitter = require('events').EventEmitter
;

var ALL_SPACES = / /g;

// ****************************************************************
// ****************** NOTES: **************************************
// ****************************************************************
// Emitters are used only for logging and introspection and inspection.
// They should not be used for adding functionality to error handling
//   and flow control.

// ****************************************************************
// ****************** Helpers *************************************
// ****************************************************************

function throw_it(msg) {
  if (!msg)
    throw new Error('Unknown error');
  if (msg && msg.message)
    throw msg;
  throw new Error("" + msg);
}

function find_job(args) { // ie find job in arguments array
  return _.find(_.flatten(_.toArray(args)), function (v) {
    return v && v.is_job;
  });
}

function origin(unk) {
  return _.last(parents(unk));
};

function parent(unk) {
  return unk.parent_job || unk.river;
}

function parents(unk) {
  if (!parent(unk))
    return [];

  var anc     = [];
  var current = parent(unk);

  while(!current) {
    anc.push(current);
    current = parent(current);
  }

  return parents;
}

function find_parent_in_error(unk) {
  return _.find(parents(unk), function (p) {
    return p && p.has_error();
  });
}

function chain_has_error(unk) {
  return unk.has_error() || !!( find_parent_in_error(unk) );
}

// ****************************************************************
// ****************** Job *****************************************
// ****************************************************************


var Job = function () { this.is_job = true; };
var ERROR_NAMES = ['not_found', 'not_valid', 'error'];

Job.new = function (vals) {
  var me      = new Job();
  me.replys   = [];
  me.result   = undefined;
  me.is_fin   = false;
  me.data     = {};

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
    if (me.is_fin || parent(me).is_finished())
      return null;

    me.is_fin = true;
    var args = arguments;
    var l = args.length;

    if (l > 0)
      me.reply.apply(me, arguments);


    if (!me.has_error())
      return parent(me).finish(me);

    var err  = me.about_error;
    var type = err.type;
    var msg  = err.msg;

    var err_func = me.get(type);
    if (!err_func)
      return parent(me).finish(me);

    var fin = {
      job    : me,
      finish : function () {
        if (arguments.length > 0)
          me.reply.apply(me, arguments);
        return parent(me).finish(me);
      }
    };

    me.set(type, null);
    return err_func(fin);

  };

  return me;
};

Job.prototype.is_finished = function () {
  return !!this.is_fin;
};

Job.prototype.set = function (type, func) {
  if (type === 'invalid')
    type = 'not_valid';

  this.data[type] = func;
  return this;
};

Job.prototype.get = function (key, def_val) {
  if (key === 'invalid')
    key = 'not_valid';
  if (!this.data.hasOwnProperty(key))
    return def_val;
  return this.data[key];
};

Job.prototype.reply = function () {
  var a = arguments;
  var l = a.length;
  if (l === 1) {
    var rep = a[0];
    if (rep && rep.has_error && rep.has_error()) {
      var err = rep.about_error;
      this.has_error(err.type, err.msg);
    } else {
      this.replys.push(rep);
      this.result = rep;
    }
  } else if (l > 1) {
    var type = arguments[0], msg = arguments[1];
    if (type === 'invalid')
      type = 'not_valid';

    if(!type)
      type = 'error';
    if (!msg)
      msg = 'Unknown error.';

    this.has_error(type, msg);
  }
  return this;
};

Job.prototype.has_error = function (type, msg) {
  var me = this;

  if (!arguments.length)
    return !!me.about_error;

  me.about_error = { msg: msg, type: type };
  return me;
};

Job.prototype.final_finish = function () {
};



// ****************************************************************
// ****************** River ***************************************
// ****************************************************************


function River() {}
exports.River = River;
River.uniq_id = 0;

River.new = function () {

  var me = new River;
  me.job_list     = [];
  me.waits        = [];
  me.replys       = [];
  me.data         = {};
  me.uniq_job_id  = 0;
  me.is_river     = true;
  me.emitter      = new Emitter;
  me.parent_job   = find_job(arguments);

  return me;
};


River.prototype.set = function (name, val) {
  this.data[name] = val;
  return this;
};

River.prototype.get = function (name, defut) {
  if (name === 'invalid')
    name = 'not_valid';
  if (this.data.hasOwnProperty(name))
    return this.data[name];
  return defut;
};

River.prototype.has_error = function (type, msg, job) {
  var me = this;

  if (!arguments.length)
    return !!me.about_error;

  me.is_fin = true;

  me.about_error = {type: type, msg: msg, job: job};
  return me;
};

River.prototype.set = function (type, func) {
  var me = this;
  if (type === 'invalid')
    type = 'not_valid';
  me.data[type] = func;
  return me;
};

River.prototype.before_each = function (func) {
  var me = this;
  me.emitter.on('before job', func);
  return me;
};

River.prototype.next = function (type, func) {
  if (!this.for_next_job)
    this.for_next_job = [];
  this.for_next_job.push([type,func]);
  return this;
};

River.prototype.next_empty = function (raw_f) {
  if (!this.rel_jobs)
    this.rel_jobs = []

  this.rel_jobs.push([ null, null, function (j, last_reply) {
    if (!last_reply ||
        (_.isString(last_reply) && last_reply.trim() === '') ||
          (_.isObject(last_reply)  && _.isEmpty(last_reply))
       )
      raw_f.apply(null, arguments);
    else
      j.finish(last_reply);
  }]);
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

  _.each((me.for_next_job || []), function (pair) {
    job.set.apply(job, pair);
  });

  me.for_next_job = null;

  me.job_list.push(job);

  var rel_jobs = me.rel_jobs || [];
  me.rel_jobs = null;

  _.each(rel_jobs, function (triple) {
    var args = triple.slice();
    if (!args[0])
      args[0] = job.group;
    if (!args[1])
      args[1] = job.id + '-empty';
    me.job.apply(me, triple);
  });



  return me;
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
  _.find(me.replys, function (hash) {
    var name = hash.name;
    if (use_both) {
      if (name === group+':'+id) {
        replys.push(hash.val);
        return true;
      }
    } else {
      if (name.index_of(group+':') > -1)
        replys.push(hash.val);
    }
    return false;
  });

  return replys;
};

River.prototype.first_reply = function () {
  return ( _.first(this.replys) || {} ).val;
};

River.prototype.last_reply = function () {
  return ( _.last(this.replys) || {} ).val;
};

River.prototype.job_finish = function (job) {
  var me = this;

  if (job.has_error()) {
    return me.has_error(job.about_error.type, job.about_error.msg);
  }

  me.replys.push({group: job.group, id: job.id, val: job.result});

  me.emitter.emit('after job', job);

  if (!me.waits.length) {
    return me.finish();
  }

  if (me.waits.length)
    me.run_job();

  return null;
};

River.prototype.is_finished = function () {
  var me = this;
  return !!this.is_fin || (parent(me) && parent(me).is_finished());
};

River.prototype.finish = function (j, unk) {
  var me     = this;

  if (me.is_fin)
    return null;

  if (j && j.is_job && !j.has_error())
    return me.job_finish(j);

  me.is_fin = true;

  var args = arguments;

  var fin = {
    river: me,
    finish: function () {
      var args = arguments;
      if (args.length === 2) {
        me.has_error(args[0], args[1]);
      } else if (args.length !== 0) {
        me.has_error('error', 'Unknown arguments: ' + _.toArray(arguments));
      }

      if (parent(me))
        return parent(me).finish(me);

      if (me.has_error())
        throw new Error(me.about_error.type + ': ' + me.about_error.msg);

      return me;
    }
  };

  if (!args.length && !me.waits.length && !me.has_error()) {

    if (me.get('finish')) {
      var func = me.get('finish');
      me.set('finish', null);
      return func(fin);
    }

    if (parent(me))
      return parent(me).finish(me.last_reply());

    return null;
  }

  if ((j && j.is_job && j.has_error()) || args.length === 2) {
    if (j && j.is_job)
      me.has_error(j.about_error.type, j.about_error.msg);
    else
      me.has_error(j, unk);

    if (me.get(me.about_error.type)) {
      var func = me.get(me.about_error.type);
      me.set(me.about_error.type, null);
      return func(fin);
    }
  }

  return fin.finish();
};

River.prototype.verbose = function () {
  this.on('before', 'job', function (j) {
    console['log'](j.group, j.id);
  });
  return this;
};

River.prototype.run_job = function () {
  if (this.has_error())
    return this;
  var me          = this;
  var job = me.job_list[me.waits.shift()];

  me.emitter.emit('before job', job);
  job.func(job, me.last_reply());

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
    this.set('finish', f);

  var me     = this;
  this.waits = _.map(this.job_list, function (j, i) {
    return i;
  });

  if ( !this.waits.length ) {
    return this;
  }

  me.run_job();
  return me;
};

River.prototype.error = function (err_or_msg, job) {
  var err= null;
  var me = this;

  if (_.isString(err_or_msg))
    err = new Error(err_or_msg);
  else
    err = err_or_msg;

  var job_had_no_events = (!job || !job.about_error || (job.emitter.events_for(job.about_error.type, 'middle').length === 0));
  if (!origin(me) && !this.emitter.events_for('error', 'middle').length) {
    if (job_had_no_events)
      throw (err || new Error('Unknown error.'));
  }

  if (job_had_no_events)
    this.emit('error', err, job);

  return this;
};








