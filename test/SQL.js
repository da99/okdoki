
var _    = require('underscore')
, SQL    = require('okdoki/lib/SQL').SQL
, assert = require('assert')
;

function clean(s) {
  return s.trim().split(/\s+/).join(' ');
}

describe( 'SQL', function () {

  it( 'generates sql for SELECT', function () {
    var sql = SQL.new()
    .select('*')
    .from('tbl')
    .where('fld = $1', [2])
    ;

    var target_sql = "SELECT * FROM tbl WHERE fld = $1 ;";
    var results    = sql.to_sql();
    assert.equal(clean(results[0]), clean(target_sql));
    assert.deepEqual(results[1], [2]);
  });

  it( 'keeps track of var names in WHERE', function () {
    var sql = SQL.new();
    sql
    .from('tbl')
    .select('*')
    .where(' f IN [$1, $1, $2]', ['a', 'b'])
    .and(  ' d IN [$1, $2, $2]', ['c', 'd'])
    ;

    var target_sql = "\
    SELECT * \
    FROM tbl \
    WHERE    \
    f IN [$1, $1, $2] \
    AND    \
    d IN [$3, $4, $4] ;";
    var results    = sql.to_sql();
    assert.equal(clean(results[0]), clean(target_sql));
    assert.deepEqual(results[1], "a b c d".split(' '));
  });

  it( 'can use another query as a table', function () {
    var target = "SELECT * \
    FROM screen_names \
    WHERE trashed_at IS NULL \
    AND name IS NOT NULL ;";

    var names = SQL.new()
    .from('screen_names')
    .where('trashed_at IS NULL')
    ;

    var r = SQL
    .new(names)
    .select('*')
    .where('name IS NOT NULL')
    .to_sql()
    ;

    assert.equal(clean(r[0]), clean(target));
  });

  it( 'can generate LEFT JOIN with ON expression', function () {
    var target = "SELECT * \
    FROM ( customers LEFT JOIN screen_names \
    ON customers.id = screen_names.customer_id \
        AND screen_names.trashed_at IS NULL ) \
    WHERE customers.name IS NOT NULL ;";

    var names = SQL.new()
    .from('screen_names')
    .where('.trashed_at IS NULL')
    ;

    var sql = SQL.new();
    sql
    .from('customers')
      .select('*')
      .where('.name IS NOT NULL')
    .left_join(names)
      .as('screen_names')
      .on('.id', '.customer_id')

    var r = sql.to_sql();
    assert.equal(clean(r[0]), clean(target));
  });
}); // === describe






