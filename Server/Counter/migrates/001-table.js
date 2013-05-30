

var table = "Counter";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE IF NOT EXISTS \"" + table + "\" (   \n\
    id             serial PRIMARY KEY,                          \n\
    owner_type_id  smallint DEFAULT 0 NOT NULL,                 \n\
    owner_id       int DEFAULT 0 NOT NULL,                      \n\
    target_id      int DEFAULT 0 NOT NULL,                      \n\
    count          smallint DEFAULT 0 NOT NULL                  \n\
    );";
    r.create(sql, "ALTER TABLE \"" + table + "\" ADD CONSTRAINT item_count UNIQUE (owner_type_id, owner_id, target_id)");

  }
};
