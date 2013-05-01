
var Topogo = require("topogo").Topogo;
var River  = require("da_river").River;

var table = '"IM"';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    Topogo.run('DROP TABLE IF EXISTS ' + table +  ';', [], r);

  } else {

    var sql = 'CREATE UNLOGGED TABLE IF NOT EXISTS ' + table + " ( \
id              serial PRIMARY KEY,     \
client_id       int default NULL,    \
re_id           int default NULL,    \
re_client_id    int default NULL,    \
\"from_id\"     int NOT NULL,        \
\"to_id\"       text default 'W',     \
labels          varchar(15) ARRAY,    \
body            text                  \
    );";
    Topogo.run(sql, [], r);
  }
};



