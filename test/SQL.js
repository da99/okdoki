
var _    = require('underscore')
, SQL    = require('okdoki/lib/SQL').SQL
, assert = require('assert')
;

function clean(s) {
  return s.trim().split(/\s+/).join(' ');
}

describe( 'SQL', function () {

  describe( '.to_sql', function () {

    it( 'generates sql for SELECT', function () {
      var sql = SQL.new();
      sql
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
      .select('*')
      .from('tbl')
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
      var target = "SELECT * FROM screen_names \
      WHERE trashed_at IS NULL AND name IS NOT NULL ;"
      var names = SQL.new();
      names.from('screen_names');
      names.where('trashed_at IS NULL');

      var sql = SQL.new();
      sql
      .select('*')
      .from(names)
      .where('name IS NOT NULL');

      var r = sql.to_sql();
      assert.equal(clean(r[0]), clean(target));
    });
  }); // === describe
}); // === describe






