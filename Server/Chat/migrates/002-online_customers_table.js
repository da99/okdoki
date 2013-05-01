
var Topogo = require("topogo").Topogo;
var River  = require("da_river").River;

var table = "online_customers";
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    Topogo.run('DROP TABLE IF EXISTS ' + table +  ';', [], r);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS ' + table + " ( \
id                serial PRIMARY KEY,                   \
customer_id       int DEFAULT NULL,                     \
screen_name_id    int DEFAULT NULL,                     \
last_seen_at      bigint default 0                      \
, CONSTRAINT unique_customer_id_to_screen_name_id UNIQUE (customer_id, screen_name_id) \
    );";
    Topogo.run(sql, [], r);

  }
};
