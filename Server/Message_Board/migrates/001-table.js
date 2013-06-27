

var table = "Message_Board";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE IF NOT EXISTS \"" + table + "\" (   \n\
    id             serial PRIMARY KEY,                          \n\
    type_id        smallint DEFAULT 1 NOT NULL,                 \n\
    website_id     int DEFAULT 0 NOT NULL,                      \n\
    $author_id     ,                                            \n\
    title          varchar(180) DEFAULT NULL,                   \n\
    body           text,                                        \n\
    body_html      text,                                        \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at                                                 \n\
    );";
    r.create(sql);

  }
};
