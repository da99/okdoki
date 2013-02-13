
var PG   = require('okdoki/lib/PG').PG
, assert = require('assert');

describe( 'PG', function () {

  describe( '.on_error', function () {

    it( 'executes on error', function (done) {
      PG.new('test on_error')
      .on_error(function (err, meta, me) {
        assert.equal(err.toString(), "error: relation \"no-table\" does not exist");
      })
      .on_error(function (err) {
        done();
      })
      .q('SELECT now() AS TIME')
      .q('SELECT * FROM "no-table";')
      .run(function () { throw new Error('Not suppose to reach here.') })
      ;
    });

  }); // === describe


  describe( '.on_finish', function () {

    it( 'executes on_finish functions after no more querys to run', function (done) {
      PG.new('test .on_finish')
      .q('SELECT now() AS TIME')
      .q('SELECT current_database() AS NAME')
      .on_finish(function (meta) {
        assert.equal(meta.rows.length, 1);
        done();
      })
      .run();

    });
  }); // === describe



}); // === describe

