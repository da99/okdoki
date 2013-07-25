
var table = 'Screen_Name';
var m = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = " \
    CREATE TABLE IF NOT EXISTS \"" + table + "\" (    \
    id                  serial PRIMARY KEY,           \
    type_id             smallint DEFAULT 0 NOT NULL,  \
    $owner_id           ,                             \
    screen_name         varchar(15) NOT NULL UNIQUE,  \
    display_name        varchar(15) NOT NULL,         \
    nick_name           varchar(30) default NULL,     \
    about               text DEFAULT null,     \
    $created_at         ,                      \
    $trashed_at                                \
    )";

    r.create(sql, "CREATE INDEX ON \"" + table + "\" (owner_id)");
  }

};
