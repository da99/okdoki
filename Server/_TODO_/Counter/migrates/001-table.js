

var table = "Counter";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS "@T" (            \n\
    id             serial PRIMARY KEY,                          \n\
    parent_class_id smallint DEFAULT 0 NOT NULL,                 \n\
    parent_id      int DEFAULT 0 NOT NULL,                      \n\
    child_class_id  smallint DEFAULT 0 NOT NULL,                 \n\
    child_id       int DEFAULT 0 NOT NULL,                      \n\
    count          smallint DEFAULT 0 NOT NULL,                 \n\
    CONSTRAINT     "@T_item_count\"                         \n\
                   UNIQUE (parent_class_id, parent_id, child_class_id, child_id)" \n\
    );'.replace(/@T/g, table);
    r.create(sql);

  }
};
