
var table = 'Post';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS \"' + table + "\" ( \
  id                  serial            PRIMARY KEY,     \
  pub_id              int               NOT NULL,        \
  origin_id           int               default NULL,    \
  parent_id           int               default NULL,    \
  author_id           int               NOT NULL,        \
  section_id          smallint NOT NULL,                 \
  ok_score            smallint NOT NULL DEFAULT 0,       \
  title               varchar(100) default null,         \
  body                text,                              \
  extra               text default '{}',                 \
  read_able           varchar(100) ARRAY,                \
  non_read_able       varchar(100) ARRAY,                \
  trashed_at          bigint DEFAULT NULL                \
    );";
    r.create(sql);

  }
};
