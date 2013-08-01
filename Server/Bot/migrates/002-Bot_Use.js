

var table = "Bot_Use";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE "@T" (                              \n\
    id             serial PRIMARY KEY,                          \n\
    bot_id         int DEFAULT 0 NOT NULL,                      \n\
    owner          varchar(50) NOT NULL,                        \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at    ,                                            \n\
    CONSTRAINT "@T_owner_bot_id" UNIQUE (owner, bot_id)         \n\
    );'.replace(/@T/g, table);
    r.create(sql,
            'CREATE INDEX "@T_bot_id_owner" ON "@T" (bot_id, owner)'.replace(/@T/g, table)
            );

  }
};
