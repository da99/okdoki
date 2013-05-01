
var table = 'Labeling';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS \"' + table + "\" ( \
id              serial PRIMARY KEY,     \
pub_id          int NOT NULL,           \
label_id        int NOT NULL,           \
trashed_at      bigint DEFAULT NULL     \
, UNIQUE (pub_id, label_id)             \
     );";
    r.create(sql);

  }
};
