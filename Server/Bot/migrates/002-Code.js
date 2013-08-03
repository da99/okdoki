

var table = "Bot_Code";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE "@T" (                              \n\
    id             serial PRIMARY KEY,                          \n\
    bot_id         int NOT NULL,                                \n\
    type           smallint DEFAULT 0 NOT NULL,                 \n\
    code           text,                                        \n\
    settings       text,                                        \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at    ,                                            \n\
    CONSTRAINT     \"@T_type\" UNIQUE (bot_id, type)            \n\
    );'.replace(/@T/g, table);
    r.create(sql);

  }
};
