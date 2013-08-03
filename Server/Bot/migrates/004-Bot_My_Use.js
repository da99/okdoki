

var table = "Bot_My_Use";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE "@T" (                              \n\
    id             serial   PRIMARY KEY,                        \n\
    owner_id       int      NOT NULL references \"Screen_Name_Sub\"(id), \n\
    bot_id         int      NOT NULL,                           \n\
    target_type    smallint NOT NULL,                           \n\
    target_id      int      NOT NULL,                           \n\
    is_on          boolean  NOT NULL DEFAULT \'f\' ,            \n\
    is_except      boolean  NOT NULL DEFAULT \'f\' ,            \n\
    settings       text,                                        \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at    ,                                            \n\
    CONSTRAINT "@T_owner" UNIQUE (owner_id, bot_id, target_type, target_id, is_except) \n\
    );'.replace(/@T/g, table);
    r.create(sql,
            'CREATE INDEX "@T_target" ON "@T" (target_id, target_type, owner_id)'.replace(/@T/g, table)
            );

  }
};
