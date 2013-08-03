

var table = "RSS_Sub";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE IF NOT EXISTS \"" + table + "\" (   \n\
    id             serial PRIMARY KEY,                          \n\
    owner_id       int NOT NULL,                                \n\
    feed_id        int NOT NULL,                                \n\
    nick_name      varchar(100) DEFAULT NULL,                   \n\
    last_read_id   int NOT NULL DEFAULT 0,                      \n\
    origin_link    text NOT NULL,                               \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at                                                 \n\
    );";

    r.create(sql,
             "ALTER TABLE \"" + table + "\" ADD CONSTRAINT \"" + table + "_owner_id_and_feed_id\"  UNIQUE (owner_id, feed_id)"
            );

  }
};
