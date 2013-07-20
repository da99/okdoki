

var table = "RSS_Post";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE IF NOT EXISTS \"" + table + "\" (   \n\
    id             serial PRIMARY KEY NOT NULL,                 \n\
    guid           TEXT NOT NULL,                               \n\
    feed_id        int NOT NULL,                                \n\
    link           TEXT NOT NULL,                               \n\
    author         char(255) NOT NULL,                          \n\
    title          char(255) NOT NULL,                          \n\
    body           TEXT NOT NULL,                               \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at                                                 \n\
    );";
    r.create(sql,
             "ALTER TABLE \"" + table + "\" ADD CONSTRAINT \"" + table + "_post_guid\"  UNIQUE (guid)"
            );

  }
};
