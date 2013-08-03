

var table = "WWW_Applet";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS "@T" (                \n\
    id             serial PRIMARY KEY,                          \n\
    link           text NOT NULL,                               \n\
    screen_name    varchar(25) NOT NULL,                        \n\
    owner_id       int NOT NULL,                                \n\
    title          varchar(100) NOT NULL,                       \n\
    bio            text NOT NULL,                               \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at    ,                                            \n\
    CONSTRAINT     "@T_screen_name_owner_id"                    \n\
                   UNIQUE (screen_name, owner_id)               \n\
    );'.replace(/@T/g, table);
    r.create(sql);

  }
};
