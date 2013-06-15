

var table = "";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE IF NOT EXISTS \"" + table + "\" (   \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at                                                 \n\
    );";
    r.create(sql);

  }
};
