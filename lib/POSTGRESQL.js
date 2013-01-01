var shutting_down = true;
var _ = require('underscore');
var pg = require('pg');
var default_owner = null;
var pg_client = function () {
  var c = new pg.Client(process.env.DATABASE_URL);
  c.connect();

  // process.on('SIGINT', function () {

    // log('Closing db connections.');
    // c.end();

  // });

  // process.on('SIGTERM', function () {

    // log('Closing db connections.');
    // c.end();

    // setTimeout( function () {
      // console.error("Could not close connections in time, forcing shut down");
      // process.exit(1);
    // }, 30*1000);

  // });

  return c;
}

function query(sql, vals, func) {
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

query.prototype.on_error = function (func) {
  this.on_error_func = func;
}

query.prototype.on_end = function (func) {
  this.on_end_func = func;
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

exports.show_databases.sql = "SELECT datname AS name FROM pg_database WHERE datistemplate = false;";



