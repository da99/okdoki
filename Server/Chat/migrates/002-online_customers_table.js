
var table = 'Online_Customer';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS "' + table + '" ( \
id                serial PRIMARY KEY,                   \
customer_id       int DEFAULT NULL,                     \
screen_name_id    int DEFAULT NULL,                     \
last_seen_at      bigint default 0                      \
, CONSTRAINT unique_customer_id_to_screen_name_id UNIQUE (customer_id, screen_name_id) \
    );';
    r.create(sql);

  }
};
