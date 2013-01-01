var shutting_down = true;

var pg = require('pg');
var default_owner = null;
var new_pg_client = function () {
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
  this.client   = new_pg_client();
  this.client.connect();
  this.querys   = [];
  this.querys.push([sql, vals]);
  this.on_error = null;
  this.on_end  = func || null;
}

query.prototype.on_error = function (func) {
  this.on_error = func;
}

query.prototype.on_end = function (func) {
  this.on_end = func;
}

query.prototype.run = function () {
  if (this.is_running)
    throw new Error('Already running.');
  else {
    this.is_running = true;
    this.run_next();
  }
}

query.prototype.run_next = function () {
  var me = query;
  if (this.querys.length === 0) {
    return false;
  }

  var q = this.querys.shift();
  this.client.query(q[0], q[1], function (err, meta) {
    var is_end = me.querys.length === 0;
    if (is_end) {
      me.client.end()
    }

    if (err) {
      if (me.on_error)
        return me.on_error(err, meta, me);
      if (me.on_end)
        return me.on_end(err, meta, me);
      throw err;
    }

    if (is_end && me.on_end)
      return me.on_end(err, meta);

    me.run_next();

  });
}

var pg_client = new_pg_client();
pg_client.query("SELECT usename AS owner FROM pg_database, pg_user WHERE datname = current_database() AND datdba = usesysid;", [], function (err, meta) {
  pg_client.end();
  if (err)
    throw err;
  default_owner = meta.rows[0].owner;
});

function log() {
  console['log'].apply(console, arguments);
}


exports.query = query;
exports.new_pg_client = new_pg_client;
exports.get_default_owner = function () {
  return default_owner;
}

exports.show_databases = function (func) {
  var pg_client = new_pg_client();
  pg_client.query("SELECT datname AS name FROM pg_database WHERE datistemplate = false;", [], function (err, meta) {
    pg_client.end();
    if (err)
      throw err;
    func(meta);
  });
}



