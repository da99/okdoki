
var table = 'Screen_Name';
var m = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = " \
    CREATE TABLE IF NOT EXISTS \"" + table + "\" ( \
    id                  serial PRIMARY KEY,   \
    owner_id            int,                  \
    screen_name         varchar(15) NOT NULL UNIQUE,  \
    display_name        varchar(15) NOT NULL UNIQUE,  \
    nick_name           varchar(30) default NULL,     \
    read_able           varchar(100) ARRAY,   \
    non_read_able       varchar(100) ARRAY,   \
    about               text default NULL,    \
    trashed_at          bigint default NULL   \
    )";

    r.create(sql, "CREATE INDEX ON \"" + table + "\" (owner_id)");
  }

};
