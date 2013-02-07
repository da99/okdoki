var _ = require('underscore')
, _base = require('okdoki/lib/base')
, J;

var error = _base.error
, log = _base.log
, warn = _base.warn
;

exports.Jobs = J = function () {

}

J.new = function () {
  var j          = new J();
  j.data         = {};
  j.data.fifo    = [];
  j.data.q       = {};
  j.data.q_count = 0;
  j.is_finish    = false;
  j.data.replys  = [];
  return j;
};

J.prototype.on_err = function (f) {
  var me = this;
  me.on_err_func = f;
};

J.prototype.on_fin = function (f) {
  var me = this;
  me.on_fin_func = f;
};

J.prototype.create = function (name, id, run) {
  var me = this;
  if (!me.data.q[name])
    me.data.q[name] = {};
  me.data.q[name][id] = {run: run};
  me.data.q_count += 1;
  me.data.fifo.push([name, id]);
  return me;
};

J.prototype.create_and_save = function (name, id, on_fin) {
  var me = this;
  me.create(name, id, on_fin);
  me.data.q[name][id]['records'] = [];

  return me;
};

J.prototype.replys = function () {
  return this.data.replys;
};

J.prototype.replys_for = function (group, id) {
  var me = this;
  var group = me.data.q[group];
  if (id)
    return group[id].records;
  return _.flatten( _.compact(_.pluck(group, 'records')) , 1);
};

J.prototype.finish = function (g, id, args) {
  var me = this;
  me.data.q_count -= 1;

  var err = null, reply = null;
  switch (args.length) {
    case 1:
      if (args[0].constructor == Error) {
        err = args[0];
      reply = args[1];
    } else {
      err = null;
      reply = args[0];
    }
    break;
    default:
      err = args[0]
    reply = args[1];
    if (args.length !== 2)
      error('Unknown number of arguments for node/io on_fin: ' + arguments.length);
  };

  if (err) {
    if (me.on_err_func)
      me.on_err_func(err, reply, g, id);
    else
      throw err;
    return null;
  }

  var meta = me.data.q[g][id];
  if (meta.hasOwnProperty('records'))
    meta.records.push(reply);
  me.data.replys.push(reply)

  if (me.data.q_count === 0) {
    if (me.on_fin_func) {
      return me.on_fin_func(me);
    }
  }

  if (me.use_fifo) {
    me.run_next_fifo();
  }
};

J.prototype.run_fifo = function (on_fin) {
  var me = this;
  me.use_fifo = true;
  return me.run(on_fin);
};

J.prototype.run_next_fifo = function () {
  var me   = this;
  var pair = me.data.fifo.shift();
  var g    = pair[0];
  var id   = pair[1];
  me.data.q[g][id].run(function () {
    me.finish(g, id, arguments);
  }, g, id);
};

J.prototype.run = function (on_fin) {
  var me = this;
  if (me.is_finish)
    throw new Error('Jobs already finished running.');
  me.is_finish = true;

  if (on_fin)
    me.on_fin(on_fin);

  if (me.use_fifo) {
    return me.run_next_fifo();
  }

  _.each(me.data.q, function (jobs, group) {
    _.each(jobs, function (meta, id) {
      meta.run(function () { me.finish(group, id, arguments); }, group, id);
    });
  });

}; // end .run