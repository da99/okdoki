
var Topogo = require("topogo").Topogo;
var River  = require("da_river").River;

var table = '"Follow"';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    Topogo.run('DROP TABLE IF EXISTS ' + table +  ';', [], r);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS ' + table + " ( \
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
    );";
    River.new(r)
    .job(function (j) {
      Topogo.run(sql, [], j);
    })
    .job(function (j) {
      Topogo.run("CREATE INDEX ON " + table + " (follower_id);", [], j);
    })
    .run();
  }
};
