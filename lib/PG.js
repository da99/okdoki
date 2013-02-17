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
  pg.replys    = [];
  pg.dups       = {};
  pg.error_funcs= [];
  return pg;
};

PG.run = function (flow, q) {
  return PG.new(flow.group + ':' + flow.id, flow)
  .q(q)
  .run(flow.finish);
};


PG.show_tables = function () {
  var sql  = PG.show_tables.sql
  , on_fin = null
  , flow   = null;

  _.each(arguments, function (v) {
    if (_.isString(v))
      sql += ' ' + v;
    else if (_.isFunction(v))
      on_fin = v;
    else
      flow = v;
  });

  var db = PG.new().q(sql).run_and_on_finish(function (rows) {
    var tables = _.pluck(rows, 'name');
    if (on_fin)
      return on_fin(tables);
    if (flow)
      return flow.finish(tables);
  });

  return db;
};

// FROM: http://stackoverflow.com/questions/769683/show-tables-in-postgresql
PG.show_tables.sql = "SELECT table_schema || '.' || table_name AS name\
  FROM    information_schema.tables         \
  WHERE   table_type = 'BASE TABLE'         \
  AND     table_schema NOT IN ('pg_catalog', 'information_schema')";


PG.prototype.q = function (v) {
  if (v.to_sql)
    v = v.to_sql();
  if(arguments.length === 1 && _.isString(v))
    v = [v, []];
  this.querys.push(v);
  return this;
};

PG.prototype.on_dup = function (name, f) {
  if(!this.dups[name])
    this.dups[name] = [];
  this.dups[name].push(f);
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

PG.prototype.run = function (f) {
  if (arguments.length > 1) {
    var msg = 'Extra arguments not allowed: ' + _.toArray(arguments).slice(1).toString();
    if (this.flow)
      return this.flow.error(msg);
    throw new Error(msg);
  }

  if (f)
    this.on_finish(f);

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

PG.prototype.on_error = function (f) {
  this.error_funcs.push(f);
  return this;
};

PG.prototype.on_finish = function (f) {
  this.finishs.push(f);
  return this;
};

PG.prototype.run_and_on_finish = function (func) {
  this.on_finish(func);
  return this.run();
};

PG.prototype.finish = function (err, meta, q) {
  var me = this;

  if (arguments.length === 0 && me.querys.length === 0) {

    var result = _.last(me.replys);

    _.each(me.finishs, function (f) {
      f(result, me);
    });

    return;
  }

  if (err) {
    var dup_f_arr = _.find(me.dups, function (arr, name) {
      if (!err.detail)
        return false;

      if (err.detail.indexOf("Key (" + name + ")=") > -1 &&
           err.detail.indexOf(") already exists") > 0)
        return arr;

      if (err.detail.indexOf("duplicate key value violates unique constrait") > -1 &&
              err.detail.indexOf("_" + name + '_') > 33)
        return arr;

      return false;
    });

    if (dup_f_arr && dup_f_arr.length) {
      _.each(dup_f_arr, function (f, i) {
        f(err, me);
      });
      return false;
    }

    _.each(me.error_funcs, function (f) {
      f(err, meta, me);
    });

    if (me.flow)
      return me.flow.error(err, meta);

    if (me.error_funcs.length)
      return false;

    throw err;
  }

  var p_key = 'pass_phrase_hash';
  if (meta.rows && meta.rows[0] && _.contains(_.keys(meta.rows[0]), p_key)) {
    _.each(meta.rows || [], function (row, i) {
      delete row[p_key];
    });
  }

  if (q && (q.row_1 || q.limit_1)) {
    if (!meta.rows.length && me.flow)
      return me.flow.not_found('Not found: ' + (me.flow.id || me.name));
    me.replys.push(meta.rows[0]);
  } else
    me.replys.push(meta.rows);

  me.run();
};


