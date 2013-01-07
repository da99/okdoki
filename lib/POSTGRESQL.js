var _         = require('underscore');
var pg        = require('pg');
var pg_hstore = require('pg-hstore');
var SqlGen    = require('sql-generator');
var uri       = require('uri-js');
var Validator = require('validator').Validator;
var check     = Validator.check;
var sanitize  = Validator.sanitize;

var shutting_down = true;
var default_owner = "postgres";
var pg_client     = function (db) {

  var db_url = process.env.DATABASE_URL;

  if (db) {
    var pieces = uri.parse(process.env.DATABASE_URL);
    pieces.path = db;
    db_url = uri.serialize(pieces);
  }

  var c = new pg.Client(db_url);
  c.connect();

  return c;
}

function query(sql, vals, func) {
  if (sql && sql.indexOf('/') === 0 && !vals) {
    this.client  = new pg_client(sql);
    sql = null;
  } else
    this.client  = new pg_client();

  this.querys = [];
  if (sql)
    this.q(sql, vals);

  this.on_error_func = null;
  this.on_end_func   = func || null;
  this.is_running    = false;
  this.is_ended      = false;
}

query.prototype.q = function (sql, vals) {
  this.querys.push([sql, vals]);
}

query.prototype.trash = function (table, id, on_fin) {
  var db = this.q("UPDATE " + table + " SET trashed_at = (now() AT TIME ZONE 'UTC') WHERE id = $1;", [id]);
  this.run_and_then(on_fin);
}

query.prototype.on_error = function (func) {
  this.on_error_func = func;
}

query.prototype.on_end = function (func) {
  this.on_end_func = func;
}

query.prototype.select_table = function (name, on_fin, on_err) {
  var sql = this.constructor.prototype.show_tables.sql.replace('WHERE', 'WHERE table_name = $1 AND ');
  this.q(sql, [name]);
  this.on_error(on_err);
  this.run_and_then(on_fin);
};

query.prototype.show_tables = function (on_fin, on_err, sql_append) {
  this.q(this.constructor.prototype.show_tables.sql + (sql_append || ''));
  this.on_error(on_err);
  this.run_and_then(on_fin);
};

// FROM: http://stackoverflow.com/questions/769683/show-tables-in-postgresql
query.prototype.show_tables.sql = "SELECT table_schema || '.' || table_name AS name\
  FROM    information_schema.tables         \
  WHERE   table_type = 'BASE TABLE'         \
  AND     table_schema NOT IN ('pg_catalog', 'information_schema')";

query.prototype.run_and_then = function (func) {
  this.on_end(func);
  this.run();
}

query.prototype.run = function () {
  if (this.is_running)
    throw new Error('Already running.');
  if (this.is_ended)
    throw new Error('Ended. Start a new query buffer.');

  this.is_running = true;
  this.run_next();
}

query.prototype.run_next = function () {
  var me = this;
  if (me.querys.length === 0) {
    return false;
  }

  var q = me.querys.shift();
  me.client.query(q[0], q[1], function (err, meta) {

    var is_end = me.querys.length === 0;

    if (is_end) {
      me.client.end()
      me.is_running = false;
      me.is_ended = true;
    }

    if (err) {
      if (me.on_error_func)
        return me.on_error_func(err, meta, me);
      throw err;
    }

    if (is_end) {
      if (me.on_end_func)
        return me.on_end_func(meta);
    } else
      return me.run_next();

  });
}

function log() {
  console['log'].apply(console, arguments);
}

exports.id_size   = 10;
exports.query     = query;
exports.pg_client = pg_client;

exports.show_default_owner = function (func) {
  if (default_owner)
    return func(default_owner);

  var on_end = function (meta) {
    default_owner = meta.rows[0].owner;
    return func(default_owner);
  }

  var q = (new query(exports.show_default_owner.sql, [], on_end));
  q.run();
}

exports.show_default_owner.sql = " \
SELECT usename AS owner \
FROM pg_database, pg_user \
WHERE datname = current_database() AND datdba = usesysid;";

exports.show_databases = function (func) {
  var client = new query(exports.show_databases.sql, [], function (meta) {
    func(_.pluck(meta.rows, 'name'));
  });
  client.run();
}

exports.show_databases.sql = "SELECT datname AS name FROM pg_database WHERE datistemplate = false AND datname LIKE 'custom%';";

var valid = require('validator');
exports.Validator = valid.Validator;
exports.check     = valid.check;
exports.sanitize  = valid.sanitize;
exports.sql_gen   = new SqlGen();
exports.hstore    = pg_hstore;
exports.id_select = function (db, table, id_col, id_val, on_fin, on_err) {
  var q = new query(db);
  var where = {};
  where[id_col] = id_val;
  var s = exports.sql_gen.select(table, '*', where);
  q.q(s.sql, s.values);
  q.on_error(on_err);
  q.run_and_then(on_fin);
};

exports.sqler = function (sql, vals) {
  var i       = -1;
  var pos     = 0;
  var new_str = null;
  var final_vals = [];
  var temp_v  = null;
  var xs      = null;

  var s = sql.replace( exports.sqler.pattern, function (a) {
    ++i;

    if (_.isString(vals[i]) || _.isNumber(vals[i])) {
      final_vals.push(vals[i]);
      return '$' + (++pos);

    } else if (_.isArray(vals[i])) {
      temp_v     = vals[i]
      xs         = _.map(temp_v, function(v, i) { return '$' + (++pos); }).join(' , ');
      final_vals = final_vals.concat(temp_v);
      return '( ' + xs + ' )';

    } else {
      temp_v     = _.flatten(_.pairs(vals[i]), true);
      xs         = _.map(temp_v, function(v, i) { return '$' + (++pos); }).join(' , ');
      final_vals = final_vals.concat(temp_v);
      return 'hstore(ARRAY[ ' + xs + ' ])';

    };

  });

  return [s, final_vals];
}

exports.sqler.pattern = /~x/g;

exports.rollback = function rollback(client, on_err) {
  return function (err, meta) {
    if (err) {
      client.query('ROLLBACK', [], function (new_err) {
        client.end();
        if (on_err)
          on_err(new_err || err);
        else
          throw (new_err || err);
      });
    };

  };
};

Validator.prototype.error = function(msg) {
  this._errors.push(msg);
  return this;
};

Validator.prototype.get_errors = function () {
  return (this._errors || []);
};

Validator.prototype.has_errors = function () {
  if (!this._errors)
    return false;
  return this._errors.length !== 0;
};


