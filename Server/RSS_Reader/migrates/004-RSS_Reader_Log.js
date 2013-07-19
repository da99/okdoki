

var table = "RSS_Reader_Log";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE IF NOT EXISTS \"" + table + "\" (   \n\
    id             serial PRIMARY KEY,                          \n\
    last_feed_id   int DEFAULT 0 NOT NULL,                      \n\
    $updated_at                                                 \n\
    );";
    r.create(sql, 'INSERT INTO "' + table + '" (updated_at) VALUES ($now);');

  }
};
