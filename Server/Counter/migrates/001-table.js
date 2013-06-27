

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
    parent_type_id smallint DEFAULT 0 NOT NULL,                 \n\
    parent_id      int DEFAULT 0 NOT NULL,                      \n\
    child_type_id  smallint DEFAULT 0 NOT NULL,                 \n\
    child_id       int DEFAULT 0 NOT NULL,                      \n\
    count          smallint DEFAULT 0 NOT NULL                  \n\
    );";
    r.create(sql, "ALTER TABLE \"" + table + "\" ADD CONSTRAINT \"" + table + "_item_count\" UNIQUE (parent_type_id, parent_id, child_type_id, child_id)");

  }
};
