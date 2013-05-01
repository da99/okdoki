
var Topogo = require("topogo").Topogo;
var River  = require("da_river").River;

var table = "labels";
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    Topogo.run('DROP TABLE IF EXISTS ' + table +  ';', [], r);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS ' + table + " ( \
id           serial PRIMARY KEY,   \
owner_id     int DEFAULT NULL,     \
label        varchar(40) NULL,     \
trashed_at   bigint DEFAULT NULL   \
, UNIQUE (owner_id, label)         \
    );";
    Topogo.run(sql, [], r);

  }
};
