

var table = "";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE IF NOT EXISTS \"" + table + "\" (   \n\
    created_at          $now_tz,                                \n\
    updated_at          $null_tz,                               \n\
    trashed_at          $null_tz                                \n\
    );";
    r.create(sql);

  }
};
