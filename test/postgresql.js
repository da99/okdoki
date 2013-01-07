
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


describe( 'sqler', function () {

  it( 'transforms objects into hstore inputs', function () {
    var actual = pg.sqler("INSERT INTO tbl (settings) VALUES ( ~x );", [{a: 'b'}]);
    var expected = [
      "INSERT INTO tbl (settings) VALUES ( hstore(ARRAY[ $1 , $2 ]) );",
      ['a', 'b']
    ];
    assert.deepEqual(actual, expected);
  });

  it( 'transforms a combination of values and objects into values and hstore inputs', function () {
    var actual = pg.sqler("VALUES ( ~x, ~x, ~x, ~x );", [1, "str1", {a: 'b', c: 'd'}, "str2"]);
    var expected = [
      "VALUES ( $1, $2, hstore(ARRAY[ $3 , $4 , $5 , $6 ]), $7 );",
      [1, "str1", 'a', 'b', 'c', 'd', "str2"]
    ];
    assert.deepEqual(actual, expected);
  });

}); // === describe
