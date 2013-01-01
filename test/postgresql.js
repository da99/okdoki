
var pg = require('okdoki/lib/POSTGRESQL');
var assert = require('assert');

describe( '.on_error', function () {

  it( 'executes on error', function (done) {
    var db = new pg.query();
    db.q('SELECT now() AS TIME');
    db.q('SELECT * FROM "no-table";');
    db.on_error(function (err) {
      assert.equal(err.toString(), "error: relation \"no-table\" does not exist");
      done();
    });
    db.run();
  });

}); // === describe


describe( '.on_end', function () {

  it( 'executes on end of all queries', function (done) {
    var db = new pg.query();
    db.q('SELECT now() AS TIME');
    db.q('SELECT current_database() AS NAME');
    db.on_end(function (meta) {
      assert.equal(meta.rows.length, 1);
      done();
    });
    db.run();

  });
}); // === describe
