
var _    = require('underscore')
, SQL    = require('okdoki/lib/SQL').SQL
, assert = require('assert')
;

function clean(s) {
  return s.trim().split(/\s+/).join(' ');
}

describe( 'SQL: select', function () {

  it( 'generates sql for SELECT', function () {
    var sql = SQL.new()
    .select('*')
    .from('tbl')
    .where('fld = $1', [2])
    ;

    var target_sql = "SELECT * FROM tbl WHERE fld = $1 ;";
    var results    = sql.to_sql();
    assert.equal(clean(results.sql), clean(target_sql));
    assert.deepEqual(results.vals, [2]);
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
    var results = sql.to_sql();
    assert.equal(clean(results.sql), clean(target_sql));
    assert.deepEqual(results.vals, "a b c d".split(' '));
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

    assert.equal(clean(r.sql), clean(target));
  });

  it( 'can generate LEFT JOIN with ON expression', function () {
    var target = "SELECT * \
    FROM ( \
      customers LEFT JOIN screen_names \
      ON customers.id = screen_names.customer_id \
    ) \
    WHERE customers.name IS NOT NULL ;";

    var names = SQL.new()
    .from('screen_names')
    .where('.trashed_at IS NULL')
    ;

    var sql = SQL.new()
    .select('*')
    .from('customers')
      .left_join('screen_names')
        .on('.id', '.customer_id')
    .where('.name IS NOT NULL')
    ;

    var r = sql.to_sql();
    assert.equal(clean(r.sql), clean(target));
  });

  it( 'can generate LEFT JOIN using a SQL.Table instead of a table name string', function () {
    var target = "SELECT * \
    FROM ( customers LEFT JOIN screen_names \
    ON customers.id = screen_names.customer_id \
        AND screen_names.trashed_at IS NULL ) \
    WHERE customers.name IS NOT NULL ;";

    var names = SQL.new()
    .from('screen_names')
    .where('.trashed_at IS NULL')
    ;

    var sql = SQL.new()
    .select('*')
    .from('customers')
      .left_join(names)
        .on('.id', '.customer_id')
    .where('.name IS NOT NULL')
    ;

    var r = sql.to_sql();
    assert.equal(clean(r.sql), clean(target));
  });

  it( 'can generate LIMIT expression', function () {
    var sql = SQL.new()
    .select('*')
    .from('tbl')
    .where('fld = $1', [2])
    .limit(1)
    ;

    var target_sql = "SELECT * FROM tbl WHERE fld = $1 LIMIT 1 ;";
    var results    = sql.to_sql();
    assert.equal(clean(results.sql), clean(target_sql));
    assert.equal(results.limit_1, true);
  });
}); // === describe

describe( 'SQL: insert', function () {

  it( 'generates INSERT statement', function () {
    var sql = SQL.new()
    .insert_into('names')
    .value('name', 'okdoki')
    .value('about', 'website')
    ;

    var target_sql = "\
      INSERT INTO names ( name, about ) \
      VALUES ( $1, $2 ) \
      RETURNING * ;";

    var results    = sql.to_sql();
    assert.equal(clean(results.sql), clean(target_sql));
    assert.deepEqual(results.vals, ['okdoki', 'website']);
  });
}); // === describe





