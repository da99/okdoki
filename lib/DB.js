var shutting_down = true;

var pg = require('pg');
pg_client = new pg.Client(process.env.DATABASE_URL);
pg_client.connect();

function log() {
  console['log'].apply(console, arguments);
}

function cleanup() {
  shutting_down = true;
  log('Closing db connections.');
  pg_client.end();
  process.exit();

  // server.close( function () {
    // log('Closing db connections.');
    // pg_client.end();
    // process.exit()
  // });
}

function force_cleanup() {
  cleanup();

  setTimeout( function () {
    console.error("Could not close connections in time, forcing shut down");
    process.exit(1);
  }, 30*1000);
}


process.on('SIGINT', cleanup);
process.on('SIGTERM', force_cleanup);
exports.pg_client = pg_client;




