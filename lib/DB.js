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



