

var table = 'Screen_Name_Sub';
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE "@T" (                              \n\
    id             serial PRIMARY KEY,                          \n\
    type_id        smallint DEFAULT 0 NOT NULL,                 \n\
    screen_name    varchar(50) NOT NULL,                        \n\
    owner          varchar(50) NOT NULL,                        \n\
    code           text,                                        \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at    ,                                            \n\
    CONSTRAINT "@T_name" UNIQUE (screen_name, owner)            \n\
    );'.replace('@T', table);
    r.create(sql);

  }
};
