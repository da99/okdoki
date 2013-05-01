var Topogo = require("topogo").Topogo;
var River  = require("da_river").River;

var table = "screen_names";
var m = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    var sql = 'DROP TABLE IF EXISTS ' + table + ' ;';
    Topogo.run(sql, [], r);

  } else {

    var sql = " \
    CREATE TABLE IF NOT EXISTS " + table + " ( \
    id                  serial PRIMARY KEY,   \
    owner_id            int  NOT NULL,        \
    screen_name         varchar(15) NOT NULL UNIQUE,  \
    display_name        varchar(15) NOT NULL UNIQUE,  \
    nick_name           varchar(30) default NULL,     \
    read_able           varchar(100) ARRAY,   \
    non_read_able       varchar(100) ARRAY,   \
    about               text default NULL,    \
    trashed_at          bigint default NULL   \
    )";

    River.new(r)
    .job(function (j) {
      Topogo.run(sql, [], j);
    })
    .job(function (j) {
      Topogo.run("CREATE INDEX ON screen_names (owner_id)", [], j);
    })
    .run();

  }

};
