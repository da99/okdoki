
var Topogo = require("topogo").Topogo;
var River  = require("da_river").River;

var table = '"Comment"';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    Topogo.run('DROP TABLE IF EXISTS ' + table +  ';', [], r);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS ' + table + " ( \
 id            serial PRIMARY KEY,    \
 author_id     int NULL,              \
 conv_id       int NOT NULL,          \
 ref_id        int NOT NULL,          \
 settings      text DEFAULT NULL,     \
 details       text DEFAULT NULL,     \
 body          text NOT NULL,         \
 updated_at    bigint DEFAULT NULL,   \
 trashed_at    bigint DEFAULT NULL    \
);";
    Topogo.run(sql, [], r);

  }
};
