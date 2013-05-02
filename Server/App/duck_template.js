

var table = "";
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE IF NOT EXISTS \"" + table + "\" (   \n\
    created_at          $now, \n\
    updated_at          timestamptz DEFAULT NULL,               \n\
    trashed_at          timestamptz DEFAULT NULL                \n\
    );";
    r.create(sql);

  }
};
