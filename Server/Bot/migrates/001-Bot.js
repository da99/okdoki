

var table = "Bot";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE "@T" (                              \n\
    screen_name_sub_id                                          \n\
       int PRIMARY KEY references \"Screen_Name_Sub\"(id),      \n\
    code           text,                                        \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at                                                 \n\
    );'.replace(/@T/g, table);
    r.create(sql);

  }
};
