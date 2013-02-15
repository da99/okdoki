
var PG   = require('okdoki/lib/PG').PG
, River  = require('okdoki/lib/River').River
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
      .run_and_on_finish(function () { throw new Error('Not suppose to reach here.') })
      ;
    });

    it( 'runs both on_error functions and River.job.error', function (done) {
      var val = null;
      River.new()
      .on_error(function (err) {
        assert.equal(err.toString(), "error: relation \"no-table\" does not exist");
        assert.equal(val, 'reached');
        done();
      })
      .job(function (j) {
        PG.new('test job', j)
        .on_error(function () {
          val = 'reached';
        })
        .q('SELECT now() AS TIME')
        .q('SELECT * FROM "no-table";')
        .run(function () { throw new Error('Not suppose to reach here.') })
      })
      .run()
      ;
    });

  }); // === describe


  describe( '.on_finish', function () {

    it( 'executes on_finish functions after no more querys to run', function (done) {
      PG.new('test .on_finish')
      .q('SELECT now() AS TIME')
      .q('SELECT current_database() AS NAME')
      .on_finish(function (rows) {
        assert.equal(rows.length, 1);
        done();
      })
      .run();

    });
  }); // === describe



}); // === describe

