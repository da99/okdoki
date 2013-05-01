
var table = 'Contact';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS ' + table + '" (  \
id            serial PRIMARY KEY,                       \
\"from_id\"   int DEFAULT NULL,                         \
\"to_id\"     int DEFAULT NULL,                         \
trashed_at    bigint DEFAULT NULL                       \
, CONSTRAINT unique_from_id UNIQUE (\"from_id\", \"to_id\") \
    );';
    r.create(sql);

  }
};
