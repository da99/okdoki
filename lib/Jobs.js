var _ = require('underscore')
, J;

exports.Jobs = J = function () {

}

J.new = function () {
  var j = new J();
  j.data.q = {};
  j.data.q_count = 0;
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
  me.data.q[name]['id'] = {run: run};
  j.data.q_count += 1;

  return me;
};

J.prototype.create_and_save = function (name, id, on_fin) {
  var me = this;
  me.create(name, id, on_fin);
  me.data.q[name][id]['records'] = [];

  return me;
};

J.prototype.replys_for = function (group, id) {
  var me = this;
  var group = me.data.q[group];
  if (id)
    return group[id].records;
  return _.flatten( _.compact(_.pluck(group, 'records')) , 1);
};

J.prototype.finish = function (g, id, err, reply) {
  var me = this;
  me.data.q_count -= 1;

  if (err) {
    if (me.on_err_func)
      me.on_err_func(err, reply, g, id);
    else
      throw err;
    return null;
  }

  var meta = me.data.q[g][id];
  if (meta.hasOwnProperty(records))
    meta.records.push(reply);

  if (me.data.q_count === 0) {
    if (me.on_fin_func)
      return me.on_fin_fun(me);
  }
};

J.prototype.run = function (on_fin) {
  var me = this;
  if (on_fin)
    me.on_fin(on_fin);

  _.each(me.data.q, function (jobs, group) {
    _.each(jobs, function (meta, id) {
      meta.run(function (err, reply) {
        me.finish(group, id, err, reply);
      });
    });
  });
};
