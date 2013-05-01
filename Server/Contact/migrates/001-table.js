
var Topogo = require("topogo").Topogo;
var River  = require("da_river").River;

var table = '"Contact"';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    Topogo.run('DROP TABLE IF EXISTS ' + table +  ';', [], r);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS ' + table + " (  \
id            serial PRIMARY KEY,                       \
\"from_id\"   int DEFAULT NULL,                         \
\"to_id\"     int DEFAULT NULL,                         \
trashed_at    bigint DEFAULT NULL                       \
, CONSTRAINT unique_from_id UNIQUE (\"from_id\", \"to_id\") \
    );";
    Topogo.run(sql, [], r);

  }
};
