
var table = 'IM';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE UNLOGGED TABLE IF NOT EXISTS \"' + table + "\" ( \
id              serial PRIMARY KEY,     \
client_id       int default NULL,    \
re_id           int default NULL,    \
re_client_id    int default NULL,    \
\"from_id\"     int NOT NULL,        \
\"to_id\"       text default 'W',     \
labels          varchar(15) ARRAY,    \
body            text                  \
    );";
    r.create(sql);
  }
};



