

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
    order_id            smallint DEFAULT 0 NOT NULL,            \n\
    website_id          int DEFAULT 0 NOT NULL,                 \n\
    owner_id            int DEFAULT 0 NOT NULL,                 \n\
    title               char(123),                              \n\
    $created_at         ,                                       \n\
    $updated_at         ,                                       \n\
    $trashed_at                                                 \n\
    );";
    r.create(sql, "ALTER TABLE \"" + table + "\" ADD CONSTRAINT folder_sub_id UNIQUE (website_id, order_id)");

  }
};
