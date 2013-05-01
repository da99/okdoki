
var table = 'Follow';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS "' + table + '" ( \
id                serial PRIMARY KEY,            \
pub_id            int DEFAULT NULL,              \
follower_id       int DEFAULT NULL,              \
ok_score          smallint NOT NULL  default 0,  \
sn_score          smallint NOT NULL  default 0,  \
settings          text default null,             \
details           text default null,             \
body              text,                          \
last_post_id      int,                           \
trashed_at        bigint DEFAULT NULL            \
    );';
      r.create(sql, "CREATE INDEX ON \"" + table + "\" (follower_id);");
  }
};
