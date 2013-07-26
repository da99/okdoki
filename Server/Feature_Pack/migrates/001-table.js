

var table = "Feature_Pack";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS "@T" (                \n\
    id             serial PRIMARY KEY,                          \n\
    owner          varchar(50) NOT NULL,                        \n\
    file_name      varchar(50) NOT NULL,                        \n\
    show_on        smallint    NOT NULL DEFAULT 1,              \n\
    body           text        NOT NULL,                        \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at    ,                                            \n\
    CONSTRAINT     "@T_owner_file_name"                         \n\
                   UNIQUE (owner, file_name)                    \n\
    );'.replace('@T', table);

    r.create(sql);
  }
};
