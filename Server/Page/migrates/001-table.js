

var table = "Page";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE \"" + table + "\" (   \n\
    id             serial PRIMARY KEY,     \n\
    folder_id      int DEFAULT 0 NOT NULL, \n\
    num            smallint DEFAULT 0 NOT NULL,            \n\
    $author_able   ,                       \n\
    title          varchar(180)          , \n\
    body           text                  , \n\
    body_html      text                  , \n\
    draft_body     text                  , \n\
    draft_body_html text                 , \n\
    $created_at    ,                                        \n\
    $updated_at    ,                                        \n\
    $trashed_at                                             \n\
    );";
    r.create(sql,
             "ALTER TABLE \"" + table + "\" ADD CONSTRAINT \"" + table + "_num\" UNIQUE (folder_id, num)",
             "ALTER TABLE \"" + table + "\" ADD CONSTRAINT \"" + table + "_title\" UNIQUE (folder_id, title)"
            );

  }
};
