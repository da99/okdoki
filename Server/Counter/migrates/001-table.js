

var table = "Counter";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS "@TABLE" (            \n\
    id             serial PRIMARY KEY,                          \n\
    parent_type_id smallint DEFAULT 0 NOT NULL,                 \n\
    parent_id      int DEFAULT 0 NOT NULL,                      \n\
    child_type_id  smallint DEFAULT 0 NOT NULL,                 \n\
    child_id       int DEFAULT 0 NOT NULL,                      \n\
    count          smallint DEFAULT 0 NOT NULL,                 \n\
    CONSTRAINT     "@TABLE_item_count\"                         \n\
                   UNIQUE (parent_type_id, parent_id, child_type_id, child_id)" \n\
    );'.replace('@TABLE', table);
    r.create(sql);

  }
};
