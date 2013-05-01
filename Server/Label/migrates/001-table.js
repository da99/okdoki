
var table = '"Label"';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS ' + table + " ( \
id           serial PRIMARY KEY,   \
owner_id     int DEFAULT NULL,     \
label        varchar(40) NULL,     \
trashed_at   bigint DEFAULT NULL   \
, UNIQUE (owner_id, label)         \
    );";
    r.create(sql);

  }
};
