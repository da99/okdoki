

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
    sub_sn         varchar(20) NOT NULL,                        \n\
    owner_id       int NOT NULL references                      \n\
      \"Screen_Name\"(id) ,                                     \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at    ,                                            \n\
    CONSTRAINT "@T_name" UNIQUE (owner_id, sub_sn)              \n\
    );'.replace(/@T/g, table);
    r.create(sql);

  }
};
