

var table = 'Headline_Follow';
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS "@T" (                \n\
    id             serial PRIMARY KEY,                          \n\
    owner_id       int NOT NULL,                                \n\
    publisher      varchar(50) NOT NULL,                        \n\
    $created_at    ,                                            \n\
    updated_at     $now_tz NOT NULL,                            \n\
    last_read_at   $now_tz NOT NULL,                            \n\
    $trashed_at                                                 \n\
    );'.replace(/@T/g, table);
    r.create(sql,
            "CREATE INDEX ON \"@T\" (owner_id, publisher)".replace(/@T/g, table)
            );

  }
};
