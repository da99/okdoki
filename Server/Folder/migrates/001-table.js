

var table = "Folder";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE IF NOT EXISTS \"" + table + "\" (   \n\
    id                  serial PRIMARY KEY,                     \n\
    num                 smallint DEFAULT 0 NOT NULL,            \n\
    website_id          $id_type,                               \n\
    $owner_id           ,                                       \n\
    title               char(123),                              \n\
    $created_at         ,                                       \n\
    $trashed_at                                                 \n\
    );";
    r.create(sql,
             "ALTER TABLE \"" + table + "\" ADD CONSTRAINT folder_num    UNIQUE (website_id, num)",
             "ALTER TABLE \"" + table + "\" ADD CONSTRAINT folder_title  UNIQUE (website_id, title)"
            );

  }
};
