
var _    = require('underscore')
, SQL    = require('okdoki/lib/SQL').SQL
, assert = require('assert')
;

function clean(s) {
  return s.split(/\s+/).join(' ');
}

describe( 'SQL', function () {
  describe( '.to_sql', function () {
    it( 'generates sql for SELECT', function () {
      var sql = SQL.new();
      sql
      .select('*')
      .from('tbl')
      .where(' fld = $1 ', 2)
      ;

      var target_sql = "SELECT * FROM tbl WHERE fld = $1 ";
      var results    = sql.to_sql();
      assert.equal(clean(results[0]), clean(target_sql));
      assert.deepEqual(results[1], [2]);

    });
  }); // === describe
}); // === describe
