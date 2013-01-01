
var pg = require('okdoki/lib/POSTGRESQL');
var assert = require('assert');

describe( '.on_error', function () {

  it( 'executes on error', function (done) {
    var db = new pg.query('SELECT * FROM "no-table";');
    db.on_error(function (err) {
      assert.equal(err.toString(), "error: relation \"no-table\" does not exist");
      done();
    });
    db.run();
  });

}); // === describe
