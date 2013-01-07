
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

  it( 'transforms an array into ( $1 , ... )', function () {
    var actual = pg.sqler("WHERE a in ( ~x )", [[1,2,3]]);
    var expected = [
      "WHERE a in ( $1 , $2 , $3 )",
      [ 1, 2, 3]
    ];
    assert.deepEqual(actual, expected);
  });

  it( 'transforms a combination of values, arrays, and objects into values, arrays, hstore inputs', function () {
    var actual = pg.sqler("VALUES ( ~x, ~x, ~x, ~x ) WHERE a in ( ~x );", [1, "str1", {a: 'b', c: 'd'}, "str2", [1,2,3]]);
    var expected = [
      "VALUES ( $1, $2, hstore(ARRAY[ $3 , $4 , $5 , $6 ]), $7 ) WHERE a in ( $8 , $9 , $10 );",
      [1, "str1", 'a', 'b', 'c', 'd', "str2", 1, 2, 3]
    ];
    assert.equal(actual[0], expected[0]);
    assert.deepEqual(actual[1], expected[1]);
  });

}); // === describe
