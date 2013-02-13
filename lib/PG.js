var log = require('okdoki/lib/base').log;
var PG        = null;
var SQL       = require('okdoki/lib/SQL').SQL;
var _         = require('underscore');
var pg        = require('pg');
var uri       = require('uri-js');


var Client = function (db) {

  var db_url = process.env.DATABASE_URL;

  if (db) {
    var pieces = uri.parse(process.env.DATABASE_URL);
    pieces.path = db;
    db_url = uri.serialize(pieces);
  }

  var c = new pg.Client(db_url);
  c.connect();

  return c;
};

Client.new = function (db) {
  return Client(db);
}

exports.PG = PG = function () {
};

PG.new = function (name, flow) {
  var pg = new PG();

  pg.name       = name;
  pg.flow       = flow;
  pg.sql        = null;
  pg.querys     = [];
  pg.finishs    = [];
  pg.results    = [];
  pg.dups       = {};
  return pg;
};

PG.prototype.q = function (v) {
  if (v.to_sql)
    v = v.to_sql();
  this.querys.push(v);
  return this;
};

PG.prototype.on_dup = function (name, f) {
  this.dups[name] = f;
  return this;
};

PG.prototype.delete_all = function (name) {
  this.querys.push(['DELETE FROM ' + name + ' ;']);
  return this;
};

PG.prototype.insert_into = function (tname, vals) {
  this.q(SQL.new().insert_into(tname).values(vals).to_sql());
  return this;
};

// _.each('select delete'.split(' '), function (name) {
  // PG.prototype[name] = function () {
    // this.sql = SQL.new();
    // this.sql[name].apply(this.sql, arguments);
    // this.querys.push([this.sql]);
    // return this;
  // };
// });

_.each("from where limit".split(' '), function (name) {
  PG.prototype[name] = function () {
    this.sql[name].apply(this.sql, arguments);
    return this;
  };
});

PG.prototype.error = function (msg) {
  if (this.flow)
    this.flow.error(msg);
  else
    throw new Error(msg);
};

PG.prototype.run = function () {
  var me     = this;
  var next_q = this.querys.shift();

  if (!next_q) {
    me.client && me.client.end();
    return me.finish();
  }

  if (!me.client)
    me.client = Client.new();

  if (_.isArray(next_q)) {
    me.client.query(next_q[0], (next_q[1] || []), function (err, meta) {
      me.finish(err, meta);
    });
  } else {
    me.client.query(next_q.sql, next_q.vals, function (err, meta) {
      me.finish(err, meta, next_q);
    });
  }
};

PG.prototype.run_and_on_finish = function (func) {
  this.finishs.push(func);
  return this.run();
};

PG.prototype.finish = function (err, meta, q) {
  var me = this;

  if (arguments.length === 0 && me.querys.length === 0) {

    var result = _.last(me.results);

    if (me.finishs.length === 0 && me.flow)
      return me.flow.finish(result, me);

    _.each(me.finishs, function (f) {
      f(result, me);
    });

    return;
  }

  if (err) {
    var dup_f = _.find(me.dups, function (name, f) {
      if (err.detail &&
          err.detail.indexOf("Key (" + name + ")=") > -1 &&
            err.detail.indexOf(") already exists") > 0)
        return f;
      return false;
    });

    if (dup_f)
      return dup_f(err, me);

    if (me.flow)
      return me.flow.error(err, meta);
    throw err;
  }

  if (q && (q.just_1 || q.limit_1))
    me.results.push(meta.rows[0]);
  else
    me.results.push(meta);

  me.run();
};


