
var Topogo = require("topogo").Topogo;
var River  = require("da_river").River;

var table = "bots";
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    Topogo.run('DROP TABLE IF EXISTS ' + table +  ';', [], r);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS ' + table + " ( \n" + '\
id            serial PRIMARY KEY,           \n\
owner_id      int NOT NULL,                 \n\
name          varchar(15) NOT NULL UNIQUE,  \n\
nick_name     varchar(30) default NULL,     \n\
read_able     varchar(100) ARRAY,           \n\
non_read_able varchar(100) ARRAY,           \n\
url           varchar(255) default NULL,    \n\
trashed_at    bigint DEFAULT NULL           \n\
);';
    Topogo.run(sql, [], r);
  }
};
